import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { getEpochParams } from "src/queries/epochParams";
import { getNetworkMetrics } from "src/queries/networkMetrics";
import { DataSource } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";
import * as ed from "@noble/ed25519";
import * as blake from "blakejs";
import { verifyCIP8Signature } from "src/utils/cardano-utils";
import {
  SignatureVerificationDto,
  SignatureVerificationResult,
} from "src/types/signature.types";
import * as jsonld from "jsonld";

interface FetchMetadataOptions {
  parseJson?: boolean;
  returnRaw?: boolean;
}

@Injectable()
export class MiscellaneousService {
  constructor(
    @InjectDataSource("db-sync")
    private cexplorerService: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async getNetworkMetrics(epoch: number | null) {
    const res = await this.cexplorerService.manager.query(getNetworkMetrics, [
      epoch,
    ]);
    return res?.[0] || null;
  }

  async getEpochParams(epoch: number | null) {
    const res = await this.cexplorerService.manager.query(getEpochParams, [
      epoch,
    ]);
    return res?.[0]?.epoch_param || null;
  }

  private processUrl(url: string): string {
    if (url.startsWith("ipfs://")) {
      const ipfsHash = url.replace("ipfs://", "");
      const gateway = this.configService.get<string>("IPFS_GATEWAY");
      return `${gateway}/${ipfsHash}`;
    }
    return url;
  }

  private async fetchMetadata(url: string, options: FetchMetadataOptions = {}) {
    const { parseJson = true, returnRaw = false } = options;
    const httpUrl = this.processUrl(url);

    const response = await firstValueFrom(
      this.httpService
        .get(httpUrl, {
          headers: {
            "User-Agent": "GovTool/Signature-Verification-Tool",
            "Content-Type": "application/json",
          },
          responseType: "text",
        })
        .pipe(
          finalize(() => Logger.log(`Fetching ${httpUrl} completed`)),
          catchError((error) => {
            Logger.error("Error fetching metadata", JSON.stringify(error));
            return throwError(
              () => new BadRequestException("Failed to fetch metadata")
            );
          })
        )
    );

    const rawData = (response as any).data;

    // If raw data is requested, return it as-is
    if (returnRaw) {
      return rawData;
    }

    // Parse JSON if needed
    if (parseJson && typeof rawData !== "object") {
      try {
        return JSON.parse(rawData);
      } catch (error) {
        throw new BadRequestException("Invalid JSON format in metadata");
      }
    }

    return typeof rawData === "object" ? rawData : rawData;
  }


  private validateMetadataStructure(metadata: any): void {
    if (!metadata?.body) {
      throw new BadRequestException("Metadata does not contain body field");
    }
  }


  private validateWitnessData(author: any): void {
    if (!author?.witness?.witnessAlgorithm) {
      throw new BadRequestException("Algorithm is missing in witness");
    }

    if (!author.witness.publicKey || !author.witness.signature) {
      throw new BadRequestException(
        "Missing publicKey or signature in witness"
      );
    }
  }


  private async canonicalizeMetadata(metadata: any): Promise<Uint8Array> {
    const jsonToCanonicalize = {
      "@context": metadata["@context"],
      body: metadata.body,
    };

    const canonized = await jsonld.canonize(jsonToCanonicalize, {
      algorithm: "URDNA2015",
      format: "application/n-quads",
    });

    return new TextEncoder().encode(canonized);
  }

  async verifySignature(
    data: SignatureVerificationDto
  ): Promise<SignatureVerificationResult> {
    const { author, metadataUrl } = data;

    try {
      this.validateWitnessData(author);

      const parsedData = await this.fetchMetadata(metadataUrl, {
        parseJson: true,
      });

      this.validateMetadataStructure(parsedData);

      const canonizedBytes = await this.canonicalizeMetadata(parsedData);
      const hashedBody = blake.blake2b(canonizedBytes, undefined, 32);

      switch (author.witness.witnessAlgorithm?.toLowerCase()) {
        case "ed25519":
          return await this.verifyEd25519Signature({
            signature: author.witness.signature,
            hashedBody,
            publicKey: author.witness.publicKey,
          });
        case "cip-0008":
          return (await verifyCIP8Signature({
            signature: author.witness.signature,
            vkey: author.witness.publicKey,
            message: canonizedBytes,
          })) as unknown as SignatureVerificationResult;
        default:
          throw new BadRequestException(
            `Unsupported witness algorithm: ${author.witness.witnessAlgorithm}`
          );
      }
    } catch (error) {
      return {
        isValid: false,
        error: error.message || "Unknown error during signature verification",
      };
    }
  }

  async verifyEd25519Signature({
    signature,
    hashedBody,
    publicKey,
  }: {
    signature: string;
    hashedBody: Uint8Array;
    publicKey: string;
    authorName?: string;
  }) {
    const signatureBytes = ed.etc.hexToBytes(signature);
    const publicKeyBytes = ed.etc.hexToBytes(publicKey);

    const isValid = await ed.verifyAsync(
      signatureBytes,
      hashedBody,
      publicKeyBytes
    );

    return {
      isValid,
      message: isValid ? "Signature is valid" : "Signature verification failed",
    };
  }

  async getExternalMetadata(url: string) {
    return await this.fetchMetadata(url, {
      parseJson: false,
      returnRaw: true,
    });
  }
}

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
import {
  SignatureVerificationDto,
  SignatureVerificationResult,
} from "src/types/signature.types";
import * as jsonld from "jsonld";

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

  async verifySignature(
    data: SignatureVerificationDto
  ): Promise<SignatureVerificationResult> {
    const { author, metadataUrl } = data;

    try {
      if (
        !author?.witness?.witnessAlgorithm ||
        author.witness.witnessAlgorithm !== "ed25519"
      ) {
        throw new BadRequestException("Only ed25519 signatures are supported");
      }

      if (!author.witness.publicKey || !author.witness.signature) {
        throw new BadRequestException(
          "Missing publicKey or signature in witness"
        );
      }

      const httpUrl = this.processUrl(metadataUrl);

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
      let parsedData;

      if (typeof rawData !== "object") {
        try {
          parsedData = JSON.parse(rawData);
        } catch (error) {
          throw new BadRequestException("Invalid JSON format in metadata");
        }
      } else {
        parsedData = rawData;
      }

      if (!parsedData?.body) {
        throw new BadRequestException("Metadata does not contain body field");
      }

      const jsonToCanonicalize = {
        "@context": parsedData["@context"],
        body: parsedData.body,
      };

      const canonized = await jsonld.canonize(jsonToCanonicalize, {
        algorithm: "URDNA2015",
        format: "application/n-quads",
      });

      const canonizedBytes = new TextEncoder().encode(canonized);
      const hashedBody = blake.blake2b(canonizedBytes, undefined, 32);

      const signatureBytes = ed.etc.hexToBytes(author.witness.signature);
      const publicKeyBytes = ed.etc.hexToBytes(author.witness.publicKey);

      const isValid = await ed.verifyAsync(
        signatureBytes,
        hashedBody,
        publicKeyBytes
      );

      return {
        isValid,
        author: author.name,
        message: isValid
          ? "Signature is valid"
          : "Signature verification failed",
      };
    } catch (error) {
      return {
        isValid: false,
        author: author.name,
        error: error.message || "Unknown error during signature verification",
      };
    }
  }
}

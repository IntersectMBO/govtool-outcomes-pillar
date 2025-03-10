import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { getGovernanceAction } from "src/queries/governanceAction";
import { getGovernanceActions } from "src/queries/governanceActions";
import { DataSource } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";
import { MetadataValidationStatus } from "src/enums/ValidationErrors";
import { getStandard } from "src/utils/getStandard";
import * as blake from "blakejs";
import * as jsonld from "jsonld";
import { validateMetadataStandard } from "src/utils/validateMetadataStandard";
import { parseMetadata } from "src/utils/parseMetadata";
import { LoggerMessage } from "src/enums/LoggerMessage";
import { ValidateMetadataResult } from "src/types/validateMetadata";

@Injectable()
export class GovernanceActionsService {
  constructor(
    @InjectDataSource("db-sync")
    private readonly cexplorerService: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  findAll(
    search: string,
    filters: string[],
    sort: string,
    page: number = 1,
    limit: number = 12
  ) {
    const searchTerm = search ? search.trim() : "";
    const filterArray = filters?.length > 0 ? filters : null;
    const sortOption = sort || "newestFirst";
    const offset = (page - 1) * limit;

    return this.cexplorerService.manager.query(getGovernanceActions, [
      searchTerm,
      filterArray,
      sortOption,
      offset,
      limit,
    ]);
  }

  private processUrl(url: string): string {
    if (url.startsWith("ipfs://")) {
      const ipfsHash = url.replace("ipfs://", "");
      const gateway = this.configService.get<string>("IPFS_GATEWAY");
      return `${gateway}/${ipfsHash}`;
    }
    return url;
  }

  async getMetadata(
    url: string,
    hash: string
  ): Promise<ValidateMetadataResult> {
    let metadataStatus: MetadataValidationStatus;
    let metadata: Record<string, unknown>;
    let standard;

    const httpUrl = this.processUrl(url);

    try {
      const response = await firstValueFrom(
        this.httpService
          .get(httpUrl, {
            headers: {
              "User-Agent": "GovTool/Metadata-Validation-Tool",
              "Content-Type": "application/json",
            },
            responseType: "text",
          })
          .pipe(
            finalize(() => Logger.log(`Fetching ${httpUrl} completed`)),
            catchError((error) => {
              Logger.error(error, JSON.stringify(error));
              throw MetadataValidationStatus.URL_NOT_FOUND;
            })
          )
      );

      const rawData = (response as any).data;

      let parsedData;

      if (typeof rawData !== "object") {
        try {
          parsedData = JSON.parse(rawData);
        } catch (error) {
          throw MetadataValidationStatus.INCORRECT_FORMAT;
        }
      } else {
        parsedData = rawData;
      }

      if (!parsedData?.body) {
        throw MetadataValidationStatus.INCORRECT_FORMAT;
      }

      if (!standard) {
        standard = getStandard(parsedData);
      }

      if (standard) {
        await validateMetadataStandard(parsedData.body, standard);
        const parsedMetadata = parseMetadata(parsedData.body);
        metadata = { ...parsedMetadata, authors: parsedData.authors || [] };
      }
      const hashedMetadata = blake.blake2bHex(rawData, undefined, 32);

      if (hashedMetadata !== hash) {
        // Optionally validate on a parsed metadata
        const hashedParsedMetadata = blake.blake2bHex(
          JSON.stringify(parsedData, null, 2),
          undefined,
          32
        );
        if (hashedParsedMetadata !== hash) {
          // Optional support for the canonized data hash
          // Validate canonized data hash
          const dataForCanonicalization =
            typeof rawData === "object" ? rawData : JSON.parse(rawData);
          const canonizedMetadata = await jsonld.canonize(
            dataForCanonicalization,
            {
              safe: false,
            }
          );

          const hashedCanonizedMetadata = blake.blake2bHex(
            canonizedMetadata,
            undefined,
            32
          );

          if (hashedCanonizedMetadata !== hash) {
            throw MetadataValidationStatus.INVALID_HASH;
          }
        }
      }
    } catch (error) {
      Logger.error(LoggerMessage.METADATA_VALIDATION_ERROR, error);
      if (Object.values(MetadataValidationStatus).includes(error)) {
        metadataStatus = error;
      }
    }

    return {
      metadataStatus,
      metadataValid: !Boolean(metadataStatus),
      data: metadata,
    };
  }

  findOne(id: string) {
    return this.cexplorerService.manager.query(getGovernanceAction, [id]);
  }
}

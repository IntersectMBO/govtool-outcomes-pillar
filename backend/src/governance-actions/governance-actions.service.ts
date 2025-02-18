import { HttpException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { getGovernanceAction } from "src/queries/governanceAction";
import { getGovernanceActions } from "src/queries/governanceActions";
import { DataSource } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GovernanceActionsService {
  constructor(
    @InjectDataSource("db-sync")
    private readonly cexplorerService: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  findAll(search: string, filters: string[], sort: string) {
    const searchTerm = search ? search.trim() : "";
    const filterArray = filters?.length > 0 ? filters : null;
    const sortOption = sort || "newestFirst";


    return this.cexplorerService.manager.query(getGovernanceActions, [
      searchTerm,
      filterArray,
      sortOption,
    ]);
  }

  private convertIpfsToHttpUrl(url: string): string {
    if (url.startsWith("ipfs://")) {
      const ipfsHash = url.replace("ipfs://", "");
      const gateway = this.configService.get<string>("IPFS_GATEWAY");
      return `${gateway}/${ipfsHash}`;
    }
    return url;
  }

  async findMetadata(url: string) {
    try {
      const httpUrl = this.convertIpfsToHttpUrl(url);

      const response$ = this.httpService.get(httpUrl).pipe(
        map((response) => {
          if (!response.data) {
            throw new Error("No data found in the response");
          }
          const metadata = response.data;
          return {
            authors: metadata.authors || [],
            hashAlgorithm: metadata.hashAlgorithm || "",
            body: {
              abstract: metadata.body?.abstract || "",
              motivation: metadata.body?.motivation || "",
              rationale: metadata.body?.rationale || "",
              references: metadata.body?.references || [],
              title: metadata.body?.title || "",
              comment: metadata.body?.comment || "",
              externalUpdates: metadata.body?.externalUpdates || [],
            },
          };
        }),
        catchError((error) => {
          if (error.response) {
            if (url.startsWith("ipfs://") && error.response.status === 504) {
              throw new HttpException(
                "IPFS gateway timeout: Content might be unavailable",
                504
              );
            }
            throw new HttpException(
              `Server error: ${error.response.status}`,
              error.response.status
            );
          } else if (error.request) {
            throw new HttpException(
              "Network error: Unable to reach the server",
              503
            );
          } else {
            throw new Error(`Error: ${error.message}`);
          }
        })
      );

      return await lastValueFrom(response$);
    } catch (error) {
      if (url.startsWith("ipfs://") && error instanceof HttpException) {
        throw new HttpException(
          `IPFS Error: ${error.message}`,
          error.getStatus()
        );
      }
      throw error;
    }
  }

  findOne(id: string) {
    return this.cexplorerService.manager.query(getGovernanceAction, [id]);
  }
}

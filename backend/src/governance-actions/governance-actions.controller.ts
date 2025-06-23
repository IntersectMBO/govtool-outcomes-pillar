import { Controller, Get, Param, Query } from "@nestjs/common";
import { GovernanceActionsService } from "./governance-actions.service";
import { ValidateMetadataResult } from "src/types/validateMetadata";

@Controller("governance-actions")
export class GovernanceActionsController {
  constructor(
    private readonly governanceActionsService: GovernanceActionsService
  ) {}

  @Get()
  findAll(
    @Query("search") search: string,
    @Query("filters") filters: string,
    @Query("sort") sort: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    const filtersArray = filters ? filters.split(",") : [];
    return this.governanceActionsService.findAll(
      search,
      filtersArray,
      sort,
      page,
      limit
    );
  }

  @Get("/metadata")
  findMetadata(
    @Query("url") url: string,
    @Query("hash") hash: string
  ): Promise<ValidateMetadataResult> {
    return this.governanceActionsService.getMetadata(url, hash);
  }

  @Get("/proposal/:hash")
  findProposal(@Param("hash") hash: string) {
    return this.governanceActionsService.findProposal(hash);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Query("index") index: number) {
    const govActionId = `${id}#${index}`;
    return this.governanceActionsService.findOne(govActionId);
  }

  @Get(":id/votes")
  findVotes(
    @Param("id") id: string,
    @Query("index") index: number,
    @Query("votesType") votesType: string = "all_votes",
    @Query("roleType") roleType: string = "all_voters",
    @Query("sortBy") sortBy: string = "vote_time",
    @Query("sortOrder") sortOrder: string = "desc",
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 20
  ) {
    const govActionId = `${id}#${index}`;
    return this.governanceActionsService.findVotes(
      govActionId,
      votesType,
      roleType,
      sortBy,
      sortOrder,
      page,
      limit
    );
  }
}

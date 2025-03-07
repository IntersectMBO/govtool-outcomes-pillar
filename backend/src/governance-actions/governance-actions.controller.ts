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

  @Get(":id")
  findOne(@Param("id") id: string, @Query("index") index: number) {
    const govActionId = `${id}#${index}`;
    return this.governanceActionsService.findOne(govActionId);
  }
}

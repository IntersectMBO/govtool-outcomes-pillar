import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { getGovernanceAction } from "src/queries/governanceAction";
import { getGovernanceActions } from "src/queries/governanceActions";
import { DataSource } from "typeorm";

@Injectable()
export class GovernanceActionsService {
  constructor(
    @InjectDataSource("db-sync")
    private readonly cexplorerService: DataSource
  ) {}
  findAll() {
    return this.cexplorerService.manager.query(getGovernanceActions);
  }

  findOne(id: string) {
    return this.cexplorerService.manager.query(getGovernanceAction, [id]);
  }
}

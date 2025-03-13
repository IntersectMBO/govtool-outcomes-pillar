import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { getEpochParams } from "src/queries/epochParams";
import { getNetworkMetrics } from "src/queries/networkMetrics";
import { DataSource } from "typeorm";

@Injectable()
export class MiscellaneousService {
  constructor(
    @InjectDataSource("db-sync")
    private cexplorerService: DataSource
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
}

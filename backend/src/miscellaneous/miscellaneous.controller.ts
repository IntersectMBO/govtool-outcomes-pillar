import { Controller, Get, Query } from "@nestjs/common";
import { MiscellaneousService } from "./miscellaneous.service";

@Controller("misc")
export class MiscellaneousController {
  constructor(private readonly miscellaneousService: MiscellaneousService) {}
  @Get("/network/metrics")
  async getNetworkMetrics(@Query("epoch") epoch: number) {
    return await this.miscellaneousService.getNetworkMetrics(epoch || null);
  }
  @Get("/epoch/params")
  async getEpochParams(@Query("epoch") epoch: number) {
    return await this.miscellaneousService.getEpochParams(epoch || null);
  }
}

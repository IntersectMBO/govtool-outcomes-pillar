import { Controller, Get } from "@nestjs/common";
import { MiscellaneousService } from "./miscellaneous.service";

@Controller("misc")
export class MiscellaneousController {
  constructor(private readonly miscellaneousService: MiscellaneousService) {}
  @Get("/network/metrics")
  async getNetworkMetrics() {
    return await this.miscellaneousService.getNetworkMetrics();
  }
  @Get("/epoch/params")
  async getEpochParams() {
    return await this.miscellaneousService.getEpochParams();
  }
}

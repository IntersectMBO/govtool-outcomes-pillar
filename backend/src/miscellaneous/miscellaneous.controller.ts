import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { MiscellaneousService } from "./miscellaneous.service";
import { SignatureVerificationDto } from "src/types/signature.types";

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

  @Post("/verify-signature")
  async verifySignature(@Body() data: SignatureVerificationDto) {
    return await this.miscellaneousService.verifySignature(data);
  }
}

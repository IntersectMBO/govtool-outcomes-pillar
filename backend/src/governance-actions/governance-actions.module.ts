import { Module } from "@nestjs/common";
import { GovernanceActionsService } from "./governance-actions.service";
import { GovernanceActionsController } from "./governance-actions.controller";

@Module({
  controllers: [GovernanceActionsController],
  providers: [GovernanceActionsService],
})
export class GovernanceActionsModule {}

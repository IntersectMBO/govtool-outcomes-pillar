import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { GovernanceActionsModule } from "./governance-actions/governance-actions.module";
import { DbModule } from "./db.module";
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.development", ".env.production"],
    }),
    DbModule,
    GovernanceActionsModule,
    MiscellaneousModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

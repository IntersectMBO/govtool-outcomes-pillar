import { Module } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { MiscellaneousController } from './miscellaneous.controller';

@Module({
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService]
})
export class MiscellaneousModule {}

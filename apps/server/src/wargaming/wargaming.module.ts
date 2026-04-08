import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WargamingService } from './wargaming.service';
import { WargamingController } from './wargaming.controller';

@Module({
  imports: [HttpModule],
  providers: [WargamingService],
  exports: [WargamingService],
  controllers: [WargamingController],
})
export class WargamingModule {}

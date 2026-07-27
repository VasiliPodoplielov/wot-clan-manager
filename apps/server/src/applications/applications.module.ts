import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "./entities/application.entity";
import { ApplicationsService } from "./applications.service";
import { ApplicationsController } from "./applications.controller";
import { EventsModule } from "../events/events.module";
import { WargamingModule } from "../wargaming/wargaming.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    EventsModule,
    WargamingModule,
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}

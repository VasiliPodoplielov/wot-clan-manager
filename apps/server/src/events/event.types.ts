import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { EventStatus } from "./event.models";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string; // 'YYYY-MM-DD'

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  primeTime: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus; // за замовчуванням CLOSED
}

export class UpdateEventStatusDto {
  @IsEnum(EventStatus)
  status: EventStatus;
}

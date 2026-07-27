import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { EventStatus } from "./event.models";
import { Event } from "./entities/event.entity";

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

// Публічна форма події для GET /events/active — без createdByUserId/createdAt,
// щоб неавторизований клієнт не бачив внутрішні службові поля.
export class EventPublicDto {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  primeTime: string;
  status: EventStatus;

  static fromEntity(event: Event): EventPublicDto {
    const dto = new EventPublicDto();
    dto.id = event.id;
    dto.name = event.name;
    dto.startDate = event.startDate;
    dto.endDate = event.endDate;
    dto.primeTime = event.primeTime;
    dto.status = event.status;
    return dto;
  }
}

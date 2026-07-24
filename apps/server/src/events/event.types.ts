import { EventStatus } from "./event.models";

export interface CreateEventDto {
  name: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;
  primeTime: string;
  status?: EventStatus; // за замовчуванням CLOSED
}

export interface UpdateEventStatusDto {
  status: EventStatus;
}

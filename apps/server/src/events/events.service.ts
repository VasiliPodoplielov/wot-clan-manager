import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { EventStatus } from "./event.models";
import { CreateEventDto } from "./event.types";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async getActive(): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { status: EventStatus.ACTIVE },
    });
  }

  async findById(id: number): Promise<Event | null> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async create(dto: CreateEventDto, createdByUserId: number): Promise<Event> {
    if (!dto.name?.trim()) {
      throw new BadRequestException("Назва події обов'язкова");
    }
    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException("Дати початку та завершення обов'язкові");
    }
    if (dto.status && !Object.values(EventStatus).includes(dto.status)) {
      throw new BadRequestException("Невірний статус події");
    }

    if (dto.status === EventStatus.ACTIVE) {
      await this.deactivateAllActive();
    }

    const event = this.eventsRepository.create({
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      primeTime: dto.primeTime,
      status: dto.status ?? EventStatus.CLOSED,
      createdByUserId,
    });

    return this.eventsRepository.save(event);
  }

  async setStatus(id: number, status: EventStatus): Promise<Event> {
    if (!Object.values(EventStatus).includes(status)) {
      throw new BadRequestException("Невірний статус події");
    }

    const event = await this.findById(id);
    if (!event) {
      throw new NotFoundException("Подію не знайдено");
    }

    if (status === EventStatus.ACTIVE) {
      await this.deactivateAllActive();
    }

    event.status = status;
    return this.eventsRepository.save(event);
  }

  private async deactivateAllActive(): Promise<void> {
    await this.eventsRepository.update(
      { status: EventStatus.ACTIVE },
      { status: EventStatus.CLOSED },
    );
  }
}

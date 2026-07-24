import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { EventStatus } from "../event.models";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // напр. "Маневри"

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column()
  primeTime: string; // напр. "19:00 - 23:00"

  @Column({
    type: "enum",
    enum: EventStatus,
    default: EventStatus.CLOSED,
  })
  status: EventStatus;

  @Column({ nullable: true })
  createdByUserId?: number; // ID користувача-адміна, плоский FK на users.id

  @CreateDateColumn()
  createdAt: Date;
}

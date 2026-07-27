import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { EventStatus } from "../event.models";

// Гарантує на рівні БД, що активною може бути лише одна подія одночасно
// (навіть при паралельних запитах на активацію).
@Entity("events")
@Index("uq_events_single_active", ["status"], {
  unique: true,
  where: `"status" = 'active'`,
})
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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";

@Entity("applications")
@Unique(["eventId", "userId"])
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number; // плоский FK на events.id

  @Column()
  userId: number; // плоский FK на users.id

  @Column({ default: false })
  isReadyForPrime: boolean;

  @Column({ default: false })
  canLead: boolean;

  @Column({ type: "text", nullable: true })
  additionalInfo?: string;

  @Column({ type: "float", default: 0 })
  wgRating: number; // WTR на момент подачі заявки

  @Column({ default: 0 })
  battles: number;

  @Column({ type: "float", default: 0 })
  winRate: number;

  @CreateDateColumn()
  createdAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserRole } from '../user.models';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password?: string; // Буде порожнім, якщо вхід через соціальні мережі

  @Column({ unique: true })
  nickname: string;

  @Column({ nullable: true })
  clanId?: number;

  @Column({ unique: true, nullable: true })
  wgAccountId: string; // ID гравця з WG OpenID

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // За замовчуванням новий гравець — user
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}

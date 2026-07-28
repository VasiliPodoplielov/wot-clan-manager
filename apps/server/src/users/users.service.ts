import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './user.models';
import { WargamingService } from '../wargaming/wargaming.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly wargamingService: WargamingService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: { email: string; nickname: string; password: string }): Promise<User> {
    const profile = await this.wargamingService.findAccountByNickname(userData.nickname);

    const newUser = this.usersRepository.create({
      email: userData.email,
      nickname: userData.nickname,
      password: userData.password,
      wgAccountId: String(profile.accountId),
    });

    return this.usersRepository.save(newUser);
  }

  async findOneByWgAccountId(wgAccountId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { wgAccountId } });
  }

  async createByWGAccountId(accountId: string, nickname: string): Promise<User> {
    // Якщо юзер існує з таким nickname (але ще без wgAccountId) – лінкуємо WG акаунт
    const existingByNickname = await this.usersRepository.findOne({
      where: { nickname },
    });

    if (existingByNickname) {
      existingByNickname.wgAccountId = accountId;
      return this.usersRepository.save(existingByNickname);
    }

    // Інакше створюємо нового користувача
    const user = this.usersRepository.create({
      wgAccountId: accountId,
      nickname,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRole(id: number, role: UserRole, requesterId: number): Promise<User> {
    if (id === requesterId) {
      throw new ConflictException('Не можна змінити власну роль');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.role = role;
    return this.usersRepository.save(user);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
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

  async create(userData: Partial<User>): Promise<User> {
    let wgAccountId = userData.wgAccountId;

    if (!wgAccountId && userData.nickname) {
      const profile = await this.wargamingService.findAccountByNickname(userData.nickname);

      wgAccountId = String(profile.accountId);
    }

    const newUser = this.usersRepository.create({
      ...userData,
      wgAccountId,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneByWgAccountId(wgAccountId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { wgAccountId } });
  }

  async createFromWargaming(accountId: string, nickname: string): Promise<User> {
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
}

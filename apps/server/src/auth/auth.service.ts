import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WargamingService } from '../wargaming/wargaming.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly wargamingService: WargamingService,
  ) {}

  async register(dto: any) {
    const candidate = await this.usersService.findOneByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  async login(dto: any) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) throw new UnauthorizedException("Ім'я користувача не знайдено");
    if (!user.password) throw new UnauthorizedException('Не вказано пароль');

    const isPassEquals = await bcrypt.compare(dto.password, user.password);

    if (!isPassEquals) throw new UnauthorizedException('Не вірний пароль');

    return this.generateToken(user);
  }

  async loginWithWargaming(callbackParams: any) {
    // 1. Отримати профіль від WG через сервіс
    const profile = await this.wargamingService.handleCallback(callbackParams);
    const { accountId, nickname } = profile;

    // 2. Спробувати знайти користувача
    let user = await this.usersService.findOneByWgAccountId(String(accountId));

    // 3. Якщо нема – створити
    if (!user) {
      user = await this.usersService.createFromWargaming(String(accountId), nickname);
    }

    // 4. Зібрати payload і видати JWT
    const payload = {
      sub: user.id,
      wgAccountId: user.wgAccountId,
      nickname: user.nickname,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      },
    };
  }
}

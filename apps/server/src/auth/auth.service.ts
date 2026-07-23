import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WargamingService } from '../wargaming/wargaming.service';
import { User } from '../users/entities/user.entity';
import {
  AuthJwtPayload,
  AuthTokenResponse,
  LoginDto,
  RegisterDto,
  WargamingAuthResponse,
  WargamingCallbackParams,
} from 'src/auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly wargamingService: WargamingService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenResponse> {
    const candidate = await this.usersService.findOneByEmail(dto.email);

    if (candidate) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto): Promise<AuthTokenResponse> {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) throw new UnauthorizedException("Ім'я користувача не знайдено");
    if (!user.password) throw new UnauthorizedException('Не вказано пароль');

    const isPassEquals = await bcrypt.compare(dto.password, user.password);

    if (!isPassEquals) throw new UnauthorizedException('Не вірний пароль');

    return this.generateToken(user);
  }

  async loginWithWargaming(
    callbackParams: WargamingCallbackParams,
  ): Promise<WargamingAuthResponse> {
    const profile = await this.wargamingService.handleCallback(callbackParams);
    const { accountId, nickname } = profile;

    let user = await this.usersService.findOneByWgAccountId(String(accountId));

    if (!user) {
      user = await this.usersService.createByWGAccountId(String(accountId), nickname);
    }

    const payload: AuthJwtPayload = {
      sub: user.id,
      wgAccountId: user.wgAccountId,
      nickname: user.nickname,
      role: user.role,
      email: user.email,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  private generateToken(user: User): AuthTokenResponse {
    const payload: AuthJwtPayload = {
      email: user.email,
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
      wgAccountId: user.wgAccountId,
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

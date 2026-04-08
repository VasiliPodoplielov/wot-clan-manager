import {
  Controller,
  Post,
  Body,
  Redirect,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WargamingService } from '../wargaming/wargaming.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly wargamingService: WargamingService,
  ) {}

  @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: any) {
    return this.authService.login(dto);
  }

  @Get('wg/login')
  @Redirect()
  wgLogin() {
    const url = this.wargamingService.buildLoginUrl();
    return { url, statusCode: 302 };
  }

  @Get('wg/callback')
  async wgCallback(@Query() query: any, @Res() res: Response) {
    const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:4200';

    // Якщо користувач натиснув "cancel" або щось пішло не так на боці WG — просто редіректимо на головну
    if (query.status !== 'ok' || !query.access_token || !query.account_id) {
      return res.redirect(302, FRONT_URL);
    }

    try {
      const result = await this.authService.loginWithWargaming(query);
      const redirectUrl = `${FRONT_URL}/auth/callback?token=${result.token}`;
      return res.redirect(302, redirectUrl);
    } catch {
      return res.redirect(302, FRONT_URL);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ClanMemberStats } from './wargaming.models';

interface WgLoginParams {
  status: string;
  access_token: string;
  account_id: string;
  nickname: string;
  [key: string]: any;
}

@Injectable()
export class WargamingService {
  private readonly applicationId: string;
  private readonly redirectUri: string;
  private readonly authUrl: string;
  private readonly profileUrl: string;
  private readonly accountListUrl: string;
  private baseWgEndpoint = 'https://api.worldoftanks.eu/wot';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.applicationId = this.configService.getOrThrow<string>('WG_APPLICATION_ID');
    this.redirectUri = this.configService.getOrThrow<string>('WG_REDIRECT_URI');
    this.authUrl =
      this.configService.get<string>('WG_AUTH_URL') ?? `${this.baseWgEndpoint}/auth/login/`;
    this.profileUrl =
      this.configService.get<string>('WG_PROFILE_URL') ?? `${this.baseWgEndpoint}/account/info/`;
    this.accountListUrl =
      this.configService.get<string>('WG_ACCOUNT_LIST_URL') ??
      `${this.baseWgEndpoint}/account/list/?${this.applicationId}`;
  }

  buildLoginUrl(): string {
    const url = new URL(this.authUrl);

    url.searchParams.set('application_id', this.applicationId);
    url.searchParams.set('redirect_uri', this.redirectUri);

    return url.toString();
  }

  async getProfileByToken(accessToken: string, accountId: string) {
    const url = new URL(this.profileUrl);

    url.searchParams.set('application_id', this.applicationId);
    url.searchParams.set('account_id', accountId);
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('fields', 'account_id,nickname');

    const response$ = this.httpService.get(url.toString());
    const { data } = await firstValueFrom(response$);

    if (data.status !== 'ok') {
      throw new Error('Failed to fetch WG profile');
    }

    const [profile] = Object.values<any>(data.data);

    return {
      accountId: profile.account_id,
      nickname: profile.nickname,
    };
  }

  async findAccountByNickname(nickname: string) {
    const url = new URL(this.accountListUrl);

    url.searchParams.set('application_id', this.applicationId);
    url.searchParams.set('search', nickname);
    url.searchParams.set('type', 'exact');

    const response$ = this.httpService.get(url.toString());
    const { data } = await firstValueFrom(response$);

    if (data.status !== 'ok' || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Wargaming account not found');
    }

    const account = data.data[0];

    return {
      accountId: account.account_id,
      nickname: account.nickname,
    };
  }

  /**
   * Метод для обробки query з callback'а WG (схема може трохи відрізнятися залежно від протоколу).
   */
  async handleCallback(params: WgLoginParams) {
    if (params.status !== 'ok' || !params.access_token) {
      throw new Error('Invalid Wargaming callback');
    }

    const profile = await this.getProfileByToken(params.access_token, params.account_id);
    return profile;
  }

  async getClanMembers(clanId: string): Promise<ClanMemberStats[]> {
    const wgResponse$ = this.httpService.get(
      `${this.baseWgEndpoint}/clans/info/?application_id=${this.applicationId}&clan_id=${clanId}&fields=members.account_id,members.account_name,members.role`,
    );

    const { data: wgData } = await firstValueFrom(wgResponse$);

    if (wgData.status !== 'ok' || !wgData.data[clanId]) {
      throw new Error('Something went wrong with Wargaming API');
    }

    const members = wgData.data[clanId].members;
    const accountIds = members.map((m) => m.account_id).join(',');

    const statsResponse$ = this.httpService.get(
      `${this.baseWgEndpoint}/account/info/?application_id=${this.applicationId}&account_id=${accountIds}&fields=statistics.all.battles,statistics.all.wins`,
    );

    const ratingsResponse$ = this.httpService.get(
      `${this.baseWgEndpoint}/account/wtr/?application_id=${this.applicationId}&account_id=${accountIds}&fields=rating`,
    );

    const { data: statsData } = await firstValueFrom(statsResponse$);
    const { data: ratingsData } = await firstValueFrom(ratingsResponse$);

    if (statsData.status !== 'ok' || ratingsData.status !== 'ok') {
      throw new Error('Wargaming API Error while fetching stats');
    }

    return members.map((member) => {
      const playerStats = statsData.data[member.account_id];
      const battles = playerStats?.statistics?.all?.battles || 0;
      const wins = playerStats?.statistics?.all?.wins || 0;

      return {
        accountId: member.account_id,
        nickname: member.account_name,
        role: member.role,
        wgRating: ratingsData.data[member.account_id]?.rating || 0,
        battles: battles,
        winRate: battles > 0 ? Number(((wins / battles) * 100).toFixed(2)) : 0,
      };
    });
  }
}

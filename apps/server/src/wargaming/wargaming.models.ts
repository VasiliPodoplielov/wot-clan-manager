export interface ClanMemberStats {
  accountId: number;
  nickname: string;
  role: string;
  wgRating: number;
  winRate: number;
  battles: number;
}

export interface UserWGData {
  accountId: number;
  nickname: string;
  clan_id: number;
}

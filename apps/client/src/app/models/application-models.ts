export interface SubmitApplicationPayload {
  eventId: number;
  isReadyForPrime: boolean;
  canLead: boolean;
  additionalInfo?: string;
}

export interface ApplicationInfo {
  id: number;
  eventId: number;
  userId: number;
  isReadyForPrime: boolean;
  canLead: boolean;
  additionalInfo?: string;
  wgRating: number;
  battles: number;
  winRate: number;
  createdAt: string;
}

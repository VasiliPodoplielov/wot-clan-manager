export interface SubmitApplicationDto {
  eventId: number;
  isReadyForPrime: boolean;
  canLead: boolean;
  additionalInfo?: string;
}

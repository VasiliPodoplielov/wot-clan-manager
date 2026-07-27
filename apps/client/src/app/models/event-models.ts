export enum EventStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface EventInfo {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  primeTime: string;
  status: EventStatus;
  createdAt: string;
}

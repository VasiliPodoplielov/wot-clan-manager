import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class SubmitApplicationDto {
  @IsInt()
  eventId: number;

  @IsBoolean()
  isReadyForPrime: boolean;

  @IsBoolean()
  canLead: boolean;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

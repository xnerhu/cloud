import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber } from "class-validator";

export const BROWSER_FEEDBACK_MAX_ATTACHMENTS = 8;

export enum BrowserFeedbackType {
  BUG = 0,
  FEATURE_REQUEST,
}

export class BrowserFeedbackDto {
  @IsString()
  summary: string;

  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  chromiumVersion: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  diagnosticData?: string;

  @IsNumber()
  @Type(() => Number)
  type: BrowserFeedbackType;
}

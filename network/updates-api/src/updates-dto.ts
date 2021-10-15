import { IsString, IsOptional } from "class-validator";

export class GetUpdatesDto {
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsOptional()
  @IsString()
  os: string;

  @IsOptional()
  @IsString()
  osVersion: string;

  @IsOptional()
  @IsString()
  architecture: string;
}

export class GetUpdatesV1Dto {
  @IsString()
  browserVersion: string;
}

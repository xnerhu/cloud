import { IsString, IsOptional } from "class-validator";

export class CreateReleaseDto {
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsOptional()
  @IsString()
  notes: string;
}

export class GetDiffInfoDto {
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsString()
  os: string;

  @IsString()
  osVersion: string;

  @IsString()
  architecture: string;
}

import { IsString, IsOptional } from 'class-validator';

export class GetPatchesDto {
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

export class GetPatchesV1Dto {
  @IsString()
  browserVersion: string;
}

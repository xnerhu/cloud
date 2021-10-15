import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class GetDistributionDto {
  @IsString()
  os: string;

  @IsString()
  osVersion: string;

  @IsString()
  architecture: string;
}

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

  @Type(() => Number)
  @IsNumber()
  distributionId: number;
}

export class UploadPatchDto {
  @Type(() => Number)
  @IsNumber()
  releaseId: number;

  @Type(() => Number)
  @IsNumber()
  distributionId: number;

  @IsString()
  hash: string;

  @IsString()
  fullHash: string;
}

import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber } from "class-validator";
import { AssetType } from "@core/updates";

import { DistributionSearchOptions, ReleaseSearchOptions } from "./updates-dto";
export class CreateReleaseDto implements ReleaseSearchOptions {
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsOptional()
  @IsString()
  notes: string;
}

export class GetDiffInfoDto
  implements ReleaseSearchOptions, DistributionSearchOptions
{
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsString()
  os: string;

  @IsString()
  architecture: string;
}

export class UploadAssetDto
  implements ReleaseSearchOptions, DistributionSearchOptions
{
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsString()
  hash: string;

  @IsString()
  os: string;

  @IsString()
  architecture: string;

  @IsNumber()
  @Type(() => Number)
  type: AssetType;
}

export class AdminReleaseRolloutDto implements ReleaseSearchOptions {
  @IsString()
  version: string;

  @IsString()
  channel: string;
}

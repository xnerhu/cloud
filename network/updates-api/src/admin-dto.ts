import { IsString, IsOptional } from "class-validator";
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
  osVersion: string;

  @IsString()
  architecture: string;
}

export class UploadPatchAssetsDto
  implements ReleaseSearchOptions, DistributionSearchOptions
{
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsString()
  patchHash: string;

  @IsString()
  packedHash: string;

  @IsString()
  os: string;

  @IsString()
  osVersion: string;

  @IsString()
  architecture: string;
}

export class UploadInstallerAssetDto
  implements ReleaseSearchOptions, DistributionSearchOptions
{
  @IsString()
  installerHash: string;

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

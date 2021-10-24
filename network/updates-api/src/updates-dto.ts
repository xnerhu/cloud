import { IsString, IsOptional } from "class-validator";

export class GetUpdatesDto
  implements DistributionSearchOptions, ReleaseSearchOptions
{
  @IsString()
  version: string;

  @IsString()
  channel: string;

  @IsOptional()
  @IsString()
  os: string;

  @IsOptional()
  @IsString()
  architecture: string;
}

export class GetUpdatesV1Dto {
  @IsString()
  browserVersion: string;
}

export interface DistributionSearchOptions {
  os: string;
  architecture: string;
}

export interface ReleaseSearchOptions {
  version: string;
  channel: string;
}

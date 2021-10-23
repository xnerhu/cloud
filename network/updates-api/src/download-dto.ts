import { IsString } from "class-validator";

export class DownloadDto {
  @IsString()
  os: string;

  @IsString()
  architecture: string;

  @IsString()
  channel: string;
}

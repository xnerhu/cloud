import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  DiskStorage,
  DiskStorageFile,
  FileInterceptor,
  UploadedFile,
} from "@common/nest";
import {
  ChangeStatusDto,
  CreateReleaseDto,
  GetDiffInfoDto,
  UploadAssetDto,
} from "@network/updates-api";

import { AdminService } from "./admin-service";
import { uploadsFilter } from "./upload-filter";
import { uploadsStorage } from "./upload-storage";
import { TokenGuard } from "../../security/token-guard";
import { AssetType, ReleaseStatusType } from "@core/updates";

@Controller("admin")
@UseGuards(TokenGuard)
export class AdminController {
  private readonly uploadStorage: DiskStorage;

  constructor(private readonly adminService: AdminService) {
    this.uploadStorage = new DiskStorage();
  }

  @Put("release")
  public createRelease(@Body() data: CreateReleaseDto) {
    return this.adminService.createRelease(data);
  }

  @Get("diff")
  public getDiffInfo(@Query() data: GetDiffInfoDto) {
    return this.adminService.getDiffInfo(data);
  }

  @Put("asset")
  @UseInterceptors(
    FileInterceptor("asset", {
      filter: uploadsFilter,
      storage: uploadsStorage,
    }),
  )
  public async uploadAsset(
    @Body() data: UploadAssetDto,
    @UploadedFile() file?: DiskStorageFile,
  ) {
    if (AssetType[data.type] == null) {
      throw new BadRequestException("Incorrect asset type");
    }

    if (file == null) {
      throw new BadRequestException("No file provided");
    }

    return this.adminService.uploadAsset(data, file);
  }

  @Post("status")
  public changeStatus(@Body() data: ChangeStatusDto) {
    if (ReleaseStatusType[data.status] == null) {
      throw new BadRequestException("Incorrect status type");
    }

    return this.adminService.changeStatus(data);
  }
}

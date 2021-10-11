import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  DiskStorageFile,
  FileFieldsInterceptor,
  UploadedFiles,
} from "@common/nest";

import {
  CreateReleaseDto,
  GetDiffInfoDto,
  GetDistributionDto,
  UploadPatchDto,
} from "./admin-dto";
import { AdminService } from "./admin-service";
import { TokenGuard } from "../security/token-guard";
import { uploadFilter } from "./upload-filter";
import { uploadsStorage } from "./uploads-storage";

@Controller("admin")
@UseGuards(TokenGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("distribution")
  public getDistribution(@Query() data: GetDistributionDto) {
    return this.adminService.getDistribution(data);
  }

  @Put("release")
  public createRelease(@Body() data: CreateReleaseDto) {
    return this.adminService.createRelease(data);
  }

  @Get("diff")
  public getDiffInfo(@Query() data: GetDiffInfoDto) {
    return this.adminService.getDiffInfo(data);
  }

  @Put("patch")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "patch" }, { name: "full" }], {
      filter: uploadFilter,
      storage: uploadsStorage,
    }),
  )
  public async uploadPatch(
    @Body() data: UploadPatchDto,
    @UploadedFiles()
    files: {
      patch: DiskStorageFile[];
      full: DiskStorageFile[];
    },
  ) {
    if (files.patch == null) {
      throw new BadRequestException("Patch file not provided");
    }

    if (files.full == null) {
      throw new BadRequestException("Full file not provided");
    }

    return this.adminService.uploadPatch(data, files.patch[0], files.full[0]);
  }
}

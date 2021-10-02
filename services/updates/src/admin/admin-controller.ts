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
import { resolve } from "path";
import {
  DiskStorage,
  DiskStorageFile,
  FileFieldsInterceptor,
  UploadedFiles,
} from "@common/nest";

import { CreateReleaseDto, GetDiffInfoDto } from "./admin-dto";
import { AdminService } from "./admin-service";
import { TokenGuard } from "../security/token-guard";
import { uploadFilter } from "./upload-filter";

@Controller("admin")
@UseGuards(TokenGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
      storage: new DiskStorage({
        dest: resolve(__dirname, "xddd"),
      }),
    }),
  )
  public async uploadPatch(
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

    console.log(files);

    return "xddd";
  }
}

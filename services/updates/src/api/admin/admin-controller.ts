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
  DiskStorage,
  DiskStorageFile,
  FileFieldsInterceptor,
  FileInterceptor,
  UploadedFile,
  UploadedFiles,
} from "@common/nest";
import {
  CreateReleaseDto,
  GetDiffInfoDto,
  UploadInstallerAssetDto,
  UploadPatchAssetsDto,
} from "@network/updates-api";

import { AdminService } from "./admin-service";
import {
  uploadInstallerAssetFilter,
  uploadPatchAssetsFilter,
} from "./upload-filter";
import { uploadsStorage } from "./upload-storage";
import { TokenGuard } from "../../security/token-guard";

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

  @Put("patch")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "patch" }, { name: "packed" }], {
      filter: uploadPatchAssetsFilter,
      storage: uploadsStorage,
    }),
  )
  public async uploadPatchAndPacked(
    @Body() data: UploadPatchAssetsDto,
    @UploadedFiles()
    files: {
      patch: DiskStorageFile[];
      packed: DiskStorageFile[];
    },
  ) {
    if (!files.patch?.length) {
      throw new BadRequestException("Patch file not provided");
    }

    if (!files.packed?.length) {
      throw new BadRequestException("Packed file not provided");
    }

    return this.adminService.uploadPatchAndPacked(
      data,
      files.patch[0],
      files.packed[0],
    );
  }

  @Put("installer")
  @UseInterceptors(
    FileInterceptor("installer", {
      filter: uploadInstallerAssetFilter,
      storage: uploadsStorage,
    }),
  )
  public async uploadInstaller(
    @Body() data: UploadInstallerAssetDto,
    @UploadedFile() installerFile?: DiskStorageFile,
  ) {
    if (installerFile == null) {
      throw new BadRequestException("No file provided");
    }

    return this.adminService.uploadInstaller(data, installerFile);
  }
}

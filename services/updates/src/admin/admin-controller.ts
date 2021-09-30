import { pump } from "@common/node";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  Res,
  // UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream } from "fs";

import { CreateReleaseDto, GetDiffInfoDto, UploadTestDto } from "./admin-dto";
import { AdminService } from "./admin-service";
import { FilesInterceptor } from "./files-interceptor";
import { TokenGuard } from "../security/token-guard";
import { AllowUnauthorizedTokenRequest } from "../security/token-exception";
import { UploadFiles } from "./upload-files-decorator";
import {
  DiskStorage,
  FileFieldsInterceptor,
  FileInterceptor,
  StorageFile,
  UploadedFiles,
  UploadedFile,
  AnyFilesInterceptor,
} from "@common/nest";

import { memoryStorage } from "multer";
import { resolve } from "path";
@Controller("admin")
// @UseGuards(TokenGuard)
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
  // @AllowUnauthorizedTokenRequest()
  // @UseInterceptors(FilesInterceptor("files", { saveToDisk: true }))
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "xd", maxCount: 4 }, { name: "xdd" }], {
      storage: new DiskStorage({
        dest: resolve(__dirname, "xddd"),
        removeAfter: true,
      }),
    }),
  )
  // @UseInterceptors(Filesint())
  public async uploadPatch(@UploadedFiles() xd: any) {
    // @UploadedFiles() files: { xd: StorageFile[] }
    // @Res() res: FastifyReply<any>, // @Req() req: FastifyRequest, // @UploadFiles() files: any, // @Body() files: UploadTestDto,
    console.log(xd);

    return "xddd";
    // console.log((req.body);

    // const parts = req.parts({ limits: { fileSize: 1000 } });

    // const data = await req.file()
    // data.file.
    // const files = req.files();

    // for await (const data of files) {
    //   await pump(data.file, createWriteStream(data.filename));

    //   console.log(data.filename, (data.file as any).truncated);
    //   // if (data.file.trn
    // }

    // console.log(req.body.xd);
    // await this.adminService.uploadPatch(parts);

    // for await (const part of parts) {
    //   if (part.file) {
    //     await pump(part.file, createWriteStream(part.filename));
    //   }
    //   console.log(
    //     "---------------------------------------------------------------------",
    //   );
    //   console.log(part);
    // }

    // if (!req.isMultipart()) {
    //   throw new BadRequestException();
    // }

    // await this.adminService.uploadPatch(req);

    // res.send("xdd");
  }
}

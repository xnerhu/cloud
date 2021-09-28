import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

import { CreateReleaseDto, GetDiffInfoDto } from "./admin-dto";
import { AdminService } from "./admin-service";

@Controller("admin")
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
  public async uploadPatch(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ) {
    const parts = req.parts();

    // for await (const part of parts) {
    //   if (part.file) {
    //     await pump(part.file, fs.createWriteStream(part.filename))
    //   }
    //   console.log(part);
    // }

    // if (!req.isMultipart()) {
    //   throw new BadRequestException();
    // }

    // await this.adminService.uploadPatch(req);

    res.send("xdd");
  }
}

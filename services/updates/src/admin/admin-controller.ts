import { Body, Controller, Get, Put, Query, Req, Res } from "@nestjs/common";
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

  @Get("info")
  public getDiffInfo(@Query() data: GetDiffInfoDto) {
    return this.adminService.getDiffInfo(data);
  }

  // @Put("release")
  // public getUpdates(@Req() req: FastifyRequest, @Res() res: FastifyReply<any>) {
  //   // req.isMultipart()
  //   // return "aha";
  //   // return this.adminService.get(data);
  // }
}

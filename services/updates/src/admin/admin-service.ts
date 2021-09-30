import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyError, FastifyRequest } from "fastify";
import { createWriteStream, WriteStream } from "fs";
import { resolve } from "path";
import { pump } from "@common/node";
import { MultipartFile } from "fastify-multipart";

import { DistributionsService } from "../distributions/distributions-service";
import { PatchesService } from "../patches/patches-service";
import { ReleaseEntity } from "../releases/release-entity";
import { ReleasesService } from "../releases/releases-service";
import { getUpdateDownloadInfo } from "../updates/updates-utils";
import { CreateReleaseDto, GetDiffInfoDto } from "./admin-dto";
import { AdminCreateReleaseResponse } from "./admin-response";

@Injectable()
export class AdminService {
  constructor(
    private readonly distributionsService: DistributionsService,
    private readonly patchesService: PatchesService,
    private readonly releasesService: ReleasesService,
    private readonly configService: ConfigService,
  ) {}

  public async createRelease({
    channel,
    notes,
    version,
  }: CreateReleaseDto): Promise<AdminCreateReleaseResponse> {
    let release: ReleaseEntity | null = await this.releasesService.findOne({
      channel,
      version,
    });

    if (!release) {
      release = await this.releasesService.createOne({
        channel,
        version,
        notes,
      });
    }

    return { releaseId: release.id };
  }

  public async getDiffInfo({ channel, version, ..._distro }: GetDiffInfoDto) {
    const distro = await this.distributionsService.findOne(_distro);

    if (!distro) {
      throw new NotFoundException("Distribution not found");
    }

    const { id: distributionId } = distro;

    const publicPath = this.configService.get<string>("UPDATES_PUBLIC_PATH");

    const entry = await this.patchesService.findOneBefore({
      distributionId,
      channel,
      version,
    });

    return getUpdateDownloadInfo(entry, false, publicPath!);
  }

  public async uploadPatch(parts: AsyncIterableIterator<MultipartFile>) {
    const updatesPath = this.configService.get<string>("UPDATES_PATH");

    let patchPath: string;
    let fullPath: string;

    let patchStream: WriteStream;
    let fullStream: WriteStream;

    try {
      for await (const part of parts) {
        if (part.file) {
          // console.log(part.fieldname, part.filepath);
          await pump(part.file, createWriteStream(part.filename));
        }
        // console.log(part);
      }
    } catch (error: any) {}
  }

  // public uploadPatch(req: FastifyRequest) {
  //   return new Promise<void>((resolve, reject) => {
  //     const params = new Map<string, any>();

  //     const onEnd = () => {
  //       resolve();
  //     };

  //     const mp = req.multipart(this.handlePatchUpload, onEnd);

  //     mp.on("field", (key: string, value: any) => {
  //       params.set(key, value);
  //     });
  //   });
  // }

  // private handlePatchUpload = async (
  //   field: string,
  //   file: any,
  //   filename: string,
  //   encoding: string,
  //   mimetype: string,
  // ) => {
  //   const updatesPath = this.configService.get<string>("UPDATES_PATH");

  //   const filePath = resolve(updatesPath!, filename);

  //   const stream = createWriteStream(filePath);

  //   await pump(file, stream);
  // };
}

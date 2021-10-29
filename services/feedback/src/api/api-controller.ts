import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { DiskStorageFile, FilesInterceptor, UploadedFiles } from "@common/nest";
import {
  BrowserFeedbackDto,
  BrowserFeedbackType,
  BROWSER_FEEDBACK_MAX_ATTACHMENTS,
} from "@network/feedback-api";

import { uploadsFilter } from "./upload-filter";
import { uploadsStorage } from "./upload-storage";
import { ApiService } from "./api-service";
import { ENV_MAX_ATTACHMENT_SIZE } from "../config/env";

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post("browser")
  @UseInterceptors(
    FilesInterceptor("attachments", BROWSER_FEEDBACK_MAX_ATTACHMENTS, {
      filter: uploadsFilter,
      storage: uploadsStorage,
      limits: {
        fileSize: ENV_MAX_ATTACHMENT_SIZE,
      },
    }),
  )
  public async browserFeedback(
    @Body() data: BrowserFeedbackDto,
    @UploadedFiles() files: DiskStorageFile[],
  ) {
    if (BrowserFeedbackType[data.type] == null) {
      throw new BadRequestException("Incorrect feedback type");
    }

    return this.apiService.browserFeedback(data, files);
  }
}

import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { DiskStorageFile, FilesInterceptor, UploadedFiles } from "@common/nest";

import { uploadsFilter } from "./upload-filter";
import { uploadsStorage } from "./upload-storage";
import { ApiService } from "./api-service";
import {
  BrowserFeedbackDto,
  BROWSER_FEEDBACK_MAX_ATTACHMENTS,
} from "@network/feedback-api";
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
    return this.apiService.browserFeedback(data, files);
  }
}

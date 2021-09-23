import { Controller, Get, Query } from '@nestjs/common';

import { GetPatchesDto, GetPatchesV1Dto } from './patches-dto';
import { PatchesService } from './patches-service';

@Controller()
export class PatchController {
  constructor(private readonly patchService: PatchesService) {}

  // Backwards compatibility with Wexond <= 6.0.5.2
  @Get('v1')
  public getPatchesV1(@Query() patchesData: GetPatchesV1Dto) {
    return this.patchService.getUpdatesV1(patchesData.browserVersion);
  }

  @Get('patches')
  public getPatches(@Query() patchesData: GetPatchesDto) {
    return this.patchService.getUpdate(patchesData);
  }
}

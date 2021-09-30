import { SetMetadata } from "@nestjs/common";

export const TOKEN_EXCEPTION_METADATA_KEY = "allowUnauthorizedRequest";

export const AllowUnauthorizedTokenRequest = () =>
  SetMetadata(TOKEN_EXCEPTION_METADATA_KEY, true);

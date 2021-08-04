import { createAppError } from '@services/common';

export const ReleaseListNotFound = createAppError({
  name: 'RELEASE_LIST_NOT_FOUND',
  description: `Releases file doesn't exists at %s!`,
});

export const IncorrectBrowserVersion = createAppError({
  name: 'INCORRECT_BROWSER_VERSION',
  description: `Browser version %s is incorrect`,
  code: 400,
});

export const IncorrectApiKey = createAppError({
  name: 'INCORRECT_API_KEY',
  description: `Incorrect API key`,
  code: 403,
});

import { createAppError } from '@backend/common';

export const INCORRECT_BROWSER_VERSION = createAppError({
  name: 'INCORRECT_BROWSER_VERSION',
  description: 'Incorrect browser version',
});

export const INCORRECT_DISTRIBUTION = createAppError({
  name: 'INCORRECT_DISTRIBUTION',
  description: 'Incorrect distribution',
});

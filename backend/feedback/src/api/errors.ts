import { createAppError } from '@services/common';

import {
  FEEDBACK_ATTACHMENTS_MAX_NUMBER,
  FEEDBACK_ATTACHMENTS_MAX_SIZE,
} from '../constants';

export const AttachmentsLimitError = createAppError({
  name: 'FEEDBACK_ATTACHMENTS_LIMIT',
  description: `Exceeded the maximal number of attachments (${FEEDBACK_ATTACHMENTS_MAX_NUMBER})`,
});

export const AttachmentsSizeLimitError = createAppError({
  name: 'FEEDBACK_ATTACHMENTS_SIZE_LIMIT',
  description: `Exceeded the maximal overall size of attachments (${FEEDBACK_ATTACHMENTS_MAX_SIZE} bytes)`,
});

export const AttachmentMimeTypeError = createAppError({
  name: 'FEEDBACK_ATTACHMENTS_SIZE_LIMIT',
  description: `Attachment must be an image`,
});

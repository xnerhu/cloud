import { handleNodeErrors } from '@backend/common';

import { App } from './app';

handleNodeErrors(App.instance.logger);
App.instance.init();

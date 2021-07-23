import { handleNodeErrors } from '@services/common';

import { App } from './app';

handleNodeErrors(App.instance.logger);
App.instance.init();

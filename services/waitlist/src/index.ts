import fastify from 'fastify';
import helmet from 'fastify-helmet';

import api from './api';

const app = fastify();

app.register(helmet);

api(app);

const main = async () => {
  app.listen(8080, async () => {
    console.log(`Listening on port 8080!`);
  });
};

main();

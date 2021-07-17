import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(helmet);
app.use(cors);

app.listen(8080, () => {});

console.log('Bug raports service is running!');

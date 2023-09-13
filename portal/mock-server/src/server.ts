import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { AddressInfo } from 'net';
import router from './router';

const PORT = 2001;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('', router);

const server = app.listen(PORT, () => {
  const address: AddressInfo = <AddressInfo>server.address();
  console.log('Portal app listening at http://localhost:%s', address.port);
});

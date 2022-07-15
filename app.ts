import express from 'express';
import * as _ from 'express-async-errors';
import mongoose from 'mongoose';
import {MONGO} from './util/conf';
import log from './util/logger'
import mw from './controllers/middleware'
import imagesRouter from './controllers/images'
import sessionsRouter from './controllers/session'
import loginRouter from './controllers/login';

mongoose.connect(MONGO.URI, {
	auth: {
		username: MONGO.USER,
		password: MONGO.PASS,
	},
	authSource: "admin"
}).then(() => log.info('connected to DB'))
.catch(e => console.error('failed to connect to DB', e));

const app = express();
app.use(express.json());
app.use(mw.reqLogger);

app.use('/api/images', imagesRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/login', loginRouter)

app.use(mw.unknownEndpoint);
app.use(mw.errHandler);

export default app;

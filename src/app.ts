import express from 'express';
import * as _ from 'express-async-errors';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {HOST, MONGO} from './util/conf.js';
import log from './util/logger.js';
import mw from './controllers/middleware.js';
import imagesRouter from './controllers/images.js';
import sessionsRouter from './controllers/session.js';
import loginRouter from './controllers/login.js';

mongoose.connect(MONGO.URI, {
	auth: {
		username: MONGO.USER,
		password: MONGO.PASS,
	},
	authSource: "admin"
}).then(() => log.info('connected to DB'))
.catch(e => console.error('failed to connect to DB', e));

const app = express();
app.use(cors({ origin: HOST.FRONTEND, credentials: true })) // TODO: specify URLs
app.use(express.json());
app.use(cookieParser())
app.use(mw.reqLogger);

app.use('/api/images', imagesRouter)
app.use('/api/sessions', mw.JWTVerifier, sessionsRouter)
app.use('/api/login', loginRouter)

app.use(mw.unknownEndpoint);
app.use(mw.errHandler);

export default app;

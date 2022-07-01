import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import {MONGO} from './util/conf';
import log from './util/logger'
import mw from './controllers/middleware'

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

export default app;

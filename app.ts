import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import conf from './util/conf';
const MONGO = conf.MONGO;

mongoose.connect(MONGO.URI, {
	auth: {
		username: MONGO.USER,
		password: MONGO.PASS,
	},
	authSource: "admin"
}).then(() => console.log('connected to DB'))
.catch(e => console.error('failed to connect to DB', e));

const app = express();

export default app;

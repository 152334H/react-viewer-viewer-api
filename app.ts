import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import {MONGO} from './util/conf';

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

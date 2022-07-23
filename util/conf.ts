import {config} from 'dotenv'
config();
import bcrypt from 'bcrypt'
interface ProcessEnv extends NodeJS.ProcessEnv {
	NODE_ENV: string
	MONGO_PROD_URI: string
	MONGO_TEST_URI: string
	MONGO_USER: string
	MONGO_PASS: string
	PORT: string
	SECRET: string
	IMAGE_DIR: string
	PASSWORD: string
	HOST_FRONTEND: string
	HOST_BACKEND: string
}

const {PORT, MONGO_PROD_URI, MONGO_TEST_URI, MONGO_USER, MONGO_PASS, NODE_ENV, SECRET, IMAGE_DIR, PASSWORD, HOST_FRONTEND, HOST_BACKEND} = <ProcessEnv>process.env;
if ([
	PORT, MONGO_PROD_URI, MONGO_TEST_URI, MONGO_USER, MONGO_PASS, NODE_ENV, SECRET, IMAGE_DIR, PASSWORD, HOST_FRONTEND, HOST_BACKEND
].some(v => typeof v !== 'string'))
  throw TypeError(".env is missing variables");

const nPORT = Number(PORT);
const MONGO = {
	URI: NODE_ENV === 'test' ? MONGO_TEST_URI : MONGO_PROD_URI,
	USER: MONGO_USER,
	PASS: MONGO_PASS,
}
const image_dir = NODE_ENV === 'test' ? IMAGE_DIR+'/test' : IMAGE_DIR
const PASSWORD_HASH = await bcrypt.hash(NODE_ENV === 'test' ? 'TEST_PASSWORD' : PASSWORD, 10);
const HOST = { // add trailing '/' if necessary
	FRONTEND: HOST_FRONTEND.replace(/\/?$/, ''), // DON'T add trailing '/'
	BACKEND: NODE_ENV === 'test' ? '' : HOST_BACKEND.replace(/\/?$/, ''), // DON'T add trailing '/'
}

export {nPORT as PORT, MONGO, NODE_ENV, SECRET, image_dir as IMAGE_DIR, PASSWORD_HASH, HOST}

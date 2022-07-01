require('dotenv').config()
const {PORT, MONGO_PROD_URI, MONGO_TEST_URI, MONGO_USER, MONGO_PASS, NODE_ENV} = process.env;
if ([
	PORT, MONGO_PROD_URI, MONGO_TEST_URI, MONGO_USER, MONGO_PASS, NODE_ENV
].some(v => typeof v !== 'string'))
  throw TypeError(".env is missing variables");

const conf = {
	PORT: Number(PORT),
	NODE_ENV: NODE_ENV,
	MONGO: {
		URI: NODE_ENV === 'test' ? MONGO_TEST_URI : MONGO_PROD_URI,
		USER: MONGO_USER,
		PASS: MONGO_PASS,
	}
}

export default conf

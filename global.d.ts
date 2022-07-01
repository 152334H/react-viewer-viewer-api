namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: string
		MONGO_PROD_URI: string
		MONGO_TEST_URI: string
		MONGO_USER: string
		MONGO_PASS: string
		PORT: string
		SECRET: string
	}
}

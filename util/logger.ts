import {NODE_ENV} from './conf.js'

const info = (...params: any[]) => {
	if (NODE_ENV !== 'test')
		console.log("INFO:", ...params)
}

export default {info}

import log from '../util/logger'
import {MW} from './types';

const reqLogger: MW<any> = (req, _, nxt) => {
	log.info(new Date().toUTCString())
	log.info(req.method)
	log.info(req.path)
	log.info(req.body)
	log.info('---')
	nxt()
}

export default {reqLogger}

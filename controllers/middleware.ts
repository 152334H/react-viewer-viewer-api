import log from '../util/logger'
import {MW, EMW, JSONErr} from './types';

const reqLogger: MW = (req, _, nxt) => {
	log.info(new Date().toUTCString())
	log.info(req.method)
	log.info(req.path)
	log.info(req.body)
	log.info('---')
	nxt()
}

const unknownEndpoint: MW<any,JSONErr> = (_, res) => {
	res.status(404).send({error: 'unknownEndpoint'})
}

const errHandler: EMW<any,JSONErr> = (err,_req,res,nxt) => {
	console.error(err.message)

	switch (err.name) {
		case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).send({ error: err.message })
    case 'JsonWebTokenError':
      return res.status(401).send({ error: 'invalid JWT'})
    case 'TokenExpiredError':
      return res.status(401).send({ error: 'JWT expired'})
	}
	nxt(err)
}

export default {reqLogger, unknownEndpoint, errHandler}

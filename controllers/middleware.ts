import log from '../util/logger'
import jwt from 'jsonwebtoken'
import {MW, EMW, JSONErr, MWErr} from './types';
import {SECRET} from '../util/conf'
import {body, param, validationResult} from 'express-validator';

const reqLogger: MW = (req, _, nxt) => {
	log.info(new Date().toUTCString())
	log.info(req.method)
	log.info(req.path)
	log.info(req.body)
	log.info('---')
	nxt()
}

const validate: MW = (req, res, nxt) => {
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return res.status(400).send({
      error: errs.array()
    })
  nxt()
}
const hasParamId = [
  param('id').isString().isLength({min: 24, max: 24}),
  validate
]
const hasBodySession = [
  body('name').isString(),
  body('imgs').isArray().bail().custom((imgs) => {
    for (const im_meta of imgs) {
      if (typeof im_meta.src != 'string') return false;
      if (!/^\/api\/images\/[0-9a-f]{2}\/[0-9a-f]{2}\/[0-9a-f]{32}/.test(im_meta.src)) return false;
      const basename = im_meta.src.split('/').pop();
      delete im_meta.src
      im_meta.basename = basename
    }
    return true
  }), validate
]
const hasBodyPassword = [
  body('password').isString().isLength({min: 0, max: 128}),
  validate
]

const unknownEndpoint: MWErr = (_, res) => {
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

const JWTVerifier: MWErr = (req, res, nxt) => {
  const auth = req.get('authorization')
  if (!auth || !auth.toLowerCase().startsWith('bearer '))
    return res.status(401).send({error: 'authorization not provided'})

  const decodedToken = <jwt.JwtPayload>jwt.verify(auth.substring(7), SECRET);
  if (!decodedToken.login)
    return res.status(401).send({error: 'JWT provided was invalid'})
  req.token = decodedToken;
  nxt()
}

export default {reqLogger, unknownEndpoint, errHandler, JWTVerifier, hasParamId, hasBodySession, hasBodyPassword}

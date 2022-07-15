import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {PASSWORD_HASH, SECRET} from '../util/conf';
import {MW} from './types';
import mw from './middleware'

const loginRouter = express.Router()

loginRouter.post('/', mw.hasBodyPassword, <MW>(async (req, res) => {
	const {password} = req.body;
  const valid = await bcrypt.compare(password, PASSWORD_HASH)
  if (!valid) return res.status(401).send({
      error: 'invalid login'
  })

  const token = jwt.sign({login: true}, SECRET, {expiresIn: 60*60})
  res.status(200).send({ token })
}))

export default loginRouter

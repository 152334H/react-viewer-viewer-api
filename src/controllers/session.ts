import express from 'express';
import _ from 'lodash'
import Session,{SessionBody} from '../models/session.js';
import {MW} from './types.js';
import mw from './middleware.js';

const sessionRouter = express.Router()

sessionRouter.get('/', async (_req, res, _nxt) => {
	//TODO: check if this returns sorted by date
	const sessions = await Session.find({});
	return res.send(sessions)
})

sessionRouter.get('/:id', mw.hasParamId, <MW>(async (req,res,_nxt) => {
	const id = req.params.id
	const sess = await Session.findById(id)
	if (sess === null)
		return res.status(404).end()

	return res.send(sess)
}))

sessionRouter.post('/', mw.hasBodySession, <MW<SessionBody>>(async (req,res,_nxt) => {
	const {name,imgs} = req.body;
	const sess = new Session({
		name, imgs
	})

	//
	sess.save()
	res.send(sess)
}))

sessionRouter.delete('/', <MW>(async (req,res,_nxt) => {
	const confirmation = req.body.confirm;
	if (confirmation !== 'YES I AM REALLY DELETING EVERYTHING')
		return res.status(500).end();
  //
	await Session.deleteMany({});
	return res.status(204).end();
}))

sessionRouter.delete('/:id', mw.hasParamId, <MW>(async (req, res,_nxt) => {
	const id = req.params.id;
	const sess = await Session.findById(id);
	if (sess === null)
		return res.status(404).end();

	await sess.remove()
	return res.status(204).end()
}))

sessionRouter.put('/:id', mw.hasParamId, mw.hasBodySession, <MW<SessionBody>>(async (req,res,_nxt) => {
	const {name,imgs} = req.body;
	const id = req.params.id;

	const sess = await Session.findByIdAndUpdate(
		id, {name,imgs},
		{new: true, runValidators: true, context: 'query'}
	); // will do nothing if id is not found

	if (sess === null)
		return res.status(404).end()
	return res.send(sess)
}))

export default sessionRouter

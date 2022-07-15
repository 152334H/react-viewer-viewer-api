import express from 'express';
import Session,{SessionBody} from '../models/session'
import _ from 'lodash'
import {MW} from './types';
import mw from './middleware'
//TODO: add auth and json validation

const sessionRouter = express.Router()

const fixBasename = (imgs: any[]) => imgs.forEach((im_meta: any) => {
	const basename = im_meta.src.split('/').pop()
	delete im_meta.src
	im_meta.basename = basename
})

sessionRouter.get('/', async (_req, res, _nxt) => {
	//TODO: check if this returns sorted by date
	const sessions = await Session.find({});
	return res.json(sessions)
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
	fixBasename(imgs)
	const sess = new Session({
		name, imgs
	})

	//
	sess.save()
	res.send(sess)
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
	fixBasename(imgs);
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

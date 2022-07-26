import express from 'express';
import fileUpload from 'express-fileupload'
import path from 'path'
import {imgPath, fileExists, apiPath, fileEqualsBuffer} from '../util/image_fs.js'
import {IMAGE_DIR} from '../util/conf.js'
import mw from '../controllers/middleware.js'
const imagesRouter = express.Router();

imagesRouter.post('/', mw.JWTVerifier, fileUpload({
			limits: {fileSize: 50*1024*1024},
			safeFileNames: true,
			preserveExtension: 4,
			createParentPath: true,
}), async (req, res, _nxt) => {
	if (req.files === undefined)
		return res.status(500).send({
			error: 'unknown error in express-fileupload'
		})
	//
	const upload = <fileUpload.UploadedFile>req.files.img
	const basename = upload.md5+path.extname(upload.name)
	const fpath = imgPath(basename)
	//
	if (await fileExists(fpath)) {
		if (await fileEqualsBuffer(fpath, upload.data))
			return res.status(409).send({
				error: 'file already exists',
				url: apiPath(basename),
			}) // technically a race condition here.
		else
			return res.status(500).send({
				error: 'hash collision detected!',
			})
	}
	//
	try { await upload.mv(fpath) }
	catch (e) {
		console.error(`POST /api/images failed to move image to '${fpath}'`)
		return res.status(500).send({
			error: 'failure in file upload process'
		})
	}
	//
	return res.status(200)
		.send({url: apiPath(basename)})
})

imagesRouter.use('/', mw.JWTCookie, express.static(IMAGE_DIR))

export default imagesRouter

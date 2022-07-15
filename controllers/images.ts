import express from 'express';
import fileUpload from 'express-fileupload'
import path from 'path'
import {imgPath, fileExists, apiPath} from '../util/image_fs'
import {IMAGE_DIR} from '../util/conf'
const imagesRouter = express.Router();

//TODO: add auth
imagesRouter.post('/', fileUpload({
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
	if (await fileExists(fpath))
		return res.status(409).send({
			error: 'file already exists (hash collision?)'
		}) // technically a race condition here.
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

imagesRouter.use('/', express.static(IMAGE_DIR))

export default imagesRouter

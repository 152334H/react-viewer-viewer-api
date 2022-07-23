import {IMAGE_DIR} from '../util/conf.js'
import path from 'path'
import fs from 'fs'

const preImgPath = (h: string) => {
	const d1 = h.slice(0,2)
	const d2 = h.slice(2,4)
	return path.join(d1,d2,h)
}
const imgPath = (h: string) => path.join(IMAGE_DIR, preImgPath(h))
const apiPath = (h: string) => path.join('/api/images/', preImgPath(h))

const fileExists = async (fpath: string) =>
	await fs.promises
	.access(fpath, fs.constants.F_OK)
	.then(() => true).catch(() => false)

const imgExists = async (h: string) =>
	await fileExists(imgPath(h))

const imgRm = async (h: string) => { // TODO: use this
	const fpath = imgPath(h)
  await fs.promises.rm(fpath)
}

if (!fs.existsSync(IMAGE_DIR))
	throw Error(`$IMAGE_DIR='${IMAGE_DIR}' does not exist!`)

export {imgPath, fileExists, imgExists, imgRm, apiPath}

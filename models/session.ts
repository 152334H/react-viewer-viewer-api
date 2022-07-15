import mongoose from "mongoose";
import {apiPath} from "../util/image_fs";

export interface ImageMeta {
	scale: number,
	left: number,
	top: number,
	rotate: number,
	mirror: boolean,
	src?: string,
	basename?: string,
}

export interface SessionBody {
	name: string,
	imgs: ImageMeta[]
}

const sessionSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 1,
		maxLength: 999,
	},
	imgs: {
		type: [{ // leave out these params at your own peril
		  basename: {
				type: String,
				required: true,
			},
			scale: Number,
			left: Number,
			top: Number,
			rotate: Number,
			mirror: Boolean,
		}],
		required: true,
		default: [],
	},
	/*
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	*/
})
sessionSchema.set('toJSON', {
	transform: (_, retObj) => {
		retObj.id = retObj._id;
		delete retObj._id;
		delete retObj.__v;
		retObj.imgs.forEach((im_meta: any) => {
			delete im_meta._id
			const src = apiPath(im_meta.basename)
			delete im_meta.basename
			im_meta.src = src;
		})
	}
})

export default mongoose.model('Session', sessionSchema);

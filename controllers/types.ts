import express from 'express'
import jwt from 'jsonwebtoken'

interface Req<T> extends Express.Request {
	method: string,
	path: string,
	get: (header: string) => string | undefined,
	body: T,
	token?: jwt.JwtPayload
}

interface Res<T> extends Express.Response {
	status: (v: number) => Res<T>
	send: (json: T) => Res<T>
}

interface JSONErr {
	error: string
}

type MW<BODY=any,JSON=any> = (req: Req<BODY>, res: Res<JSON>, nxt: express.NextFunction) => any;
type MWErr<T=any> = MW<T,JSONErr>;
type EMW<BODY=any,JSON=any> = (err: Error, req: Req<BODY>, res: Res<JSON>, nxt: express.NextFunction) => any;

export {MW, MWErr, EMW, Req, JSONErr}

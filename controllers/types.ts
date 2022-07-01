import express from 'express'

interface Req<T> extends Express.Request {
	method: string,
	path: string,
	body: T,
	token?: undefined
}

interface Res<T> extends Express.Response {
	status: (v: number) => Res<T>
	send: (json: T) => Res<T>
}

interface JSONErr {
	error: string
}

type MW<BODY=any,JSON=any> = (req: Req<BODY>, res: Res<JSON>, nxt: express.NextFunction) => any;
type EMW<BODY=any,JSON=any> = (err: Error, req: Req<BODY>, res: Res<JSON>, nxt: express.NextFunction) => any;

export {MW,EMW,Req, JSONErr}

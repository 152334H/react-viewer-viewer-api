import express from 'express'

interface Req<T> extends Express.Request {
	method: string,
	path: string,
	body: T,
	token?: undefined
}

type MW<T> = (req: Req<T>, res: Express.Response, nxt: express.NextFunction) => any;
type EMW<T> = (err: Error, req: Req<T>, res: Express.Response, nxt: express.NextFunction) => any;

export {MW,EMW,Req}

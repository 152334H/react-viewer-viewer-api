import app from '../app'
import supertest from 'supertest'
import Session from '../models/session'
import {IMAGE_DIR} from '../util/conf'
import _ from 'lodash'
import fs from 'fs'
import util from 'util'
import path from 'path'
const api = supertest(app)

beforeAll(async () => {
  await Session.deleteMany({})
  const rm = util.promisify(fs.rm)
  const rmdir = (d: string) => rm(d, {recursive: true})
  await Promise.all(fs.readdirSync(IMAGE_DIR).map(
    f => rmdir(path.join(IMAGE_DIR,f))
  ))
})

const userSession = {
  name: "test session 123",
  imgs: [{
    src: undefined,
    scale: 1, left: 1, top: 1,
    rotate: 90, mirror: true,
  }],
}

let token: string;
describe('login', () => {
    test('POST', async () => {
      const res = await api.post('/api/login')
        .send({password: "TEST_PASSWORD"})
        .expect(200)
        .expect('Content-type', /application\/json/)
      expect(res.body.token).toBeDefined()
      token = res.body.token;
    })
    test('POST invalid', async () => {
      const res = await api.post('/api/login')
        .send({password: "WRONG"})
        .expect(401)
        .expect('Content-type', /application\/json/)
      expect(res.body.error).toBe('invalid login')
    })
    test('unauthenticated', async () => {
      const res = await api.get('/api/images/ANYWHERE')
        .expect(401)
        .expect('Content-type', /application\/json/)
      expect(res.body.error).toBe('authorization not provided')
    })
    test('failed authentication', async () => {
      const res = await api.get('/api/sessions/ANYWHERE')
        .auth('INVALID', {type: 'bearer'})
        .expect(401)
        .expect('Content-type', /application\/json/)
      expect(res.body.error).toBe('invalid JWT')
    })
})

describe('images', () => {
  const REMOTE_IMGPATH = "/api/images/f4/88/f488b46abf2ab1f02877c0090659de2f.png"
  const req = () => api.post('/api/images').auth(token, {type: 'bearer'})
  test('POST', async () => {
    const res = await req()
      .set('Content-type', 'multipart/form-data')
      .attach('img', 'tests/0.png')
      .expect(200)
    expect(res.body.url).toContain(REMOTE_IMGPATH);
    userSession.imgs[0].src = res.body.url;
  })
  test('POST duplicate', async () => {
    const res = await req()
      .set('Content-type', 'multipart/form-data')
      .attach('img', 'tests/0.png')
      .expect(409)
    expect(res.body.error).toMatch(/file already exists/)
  })
  test('GET', async () => {
    const res = await api.get(REMOTE_IMGPATH)
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect('Content-type', 'image/png')
    expect(res).toBeDefined();
  })
})

describe('sessions', () => {
  let sess_id: string;
  const auth = (req: supertest.Test) => req.auth(token, {type: 'bearer'})
  test('POST /', async () => {
    const res = await auth(api.post('/api/sessions'))
      .send(userSession)
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
    sess_id = res.body.id;
  })
  test('POST / (malformatted)', async () => {
    await auth(api.post('/api/sessions'))
      .send({name: {1:'hi'}, imgs: 'what'})
      .expect(400)
      .expect('Content-type', /application\/json/)
    await auth(api.post('/api/sessions'))
      .send({nonsense: 'here'})
      .expect(400)
      .expect('Content-type', /application\/json/)
  })
  test('DELETE / (failure)', async () => {
    await auth(api.delete('/api/sessions/'))
      .expect(500)
  })
  test('GET /', async () => {
    const res = await auth(api.get('/api/sessions'))
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toStrictEqual({
      ...userSession, id: sess_id
    })
  })
  test('GET /:id', async () => {
    const res = await auth(api.get(`/api/sessions/${sess_id}`))
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
  })
  test('PUT /:id', async () => {
    userSession.name = 'new name'
    userSession.imgs.push({...userSession.imgs[0], scale: 1.2, left: 5})
    const res = await auth(api.put(`/api/sessions/${sess_id}`))
      .send(userSession)
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
  })
  test('DELETE /:id', async () => {
    await auth(api.delete(`/api/sessions/${sess_id}`))
      .expect(204);
  })
  test('inexistent sessions', async () => {
    const url = '/api/sessions/123456789012345678901234'
    await auth(api.get(url)).expect(404)
    await auth(api.delete(url)).expect(404)
    await auth(api.put(url).send(userSession)).expect(404)
  })
  test('DELETE /', async () => {
    await auth(api.delete('/api/sessions/'))
      .send({confirm: 'YES I AM REALLY DELETING EVERYTHING'})
      .expect(204);
    const res = await auth(api.get('/api/sessions'))
      .expect(200)
      .expect('Content-type', /application\/json/);
    expect(res.body).toHaveLength(0);
  })
})

describe('misc', () => {
  test('invalid endpoint', async () => {
    const res = await api.get('/api/nfiqeosjfi')
      .expect(404)
      .expect('Content-type', /application\/json/)
    expect(res.body.error).toMatch(/unknownEndpoint/)
  })
})

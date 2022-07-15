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

describe('images', () => {
  const REMOTE_IMGPATH = "/api/images/f4/88/f488b46abf2ab1f02877c0090659de2f.png"
  test('POST', async () => {
    const res = await api.post('/api/images')
      .set('Content-type', 'multipart/form-data')
      .attach('img', 'tests/0.png')
      .expect(200)
    expect(res.body.url).toContain(REMOTE_IMGPATH);
    userSession.imgs[0].src = res.body.url;
  })
  test('POST duplicate', async () => {
    const res = await api.post('/api/images')
      .set('Content-type', 'multipart/form-data')
      .attach('img', 'tests/0.png')
      .expect(409)
    expect(res.body.error).toMatch(/file already exists/)
  })
  test('GET', async () => {
    const res = await api.get(REMOTE_IMGPATH)
      .expect(200)
      .expect('Content-type', 'image/png')
    expect(res).toBeDefined()
  })
})

describe('sessions', () => {
  let sess_id: string;
  test('POST /', async () => {
    const res = await api.post('/api/sessions')
      .send(userSession)
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
    sess_id = res.body.id;
  })
  test('GET /', async () => {
    const res = await api.get('/api/sessions')
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toStrictEqual({
      ...userSession, id: sess_id
    })
  })
  test('GET /:id', async () => {
    const res = await api.get(`/api/sessions/${sess_id}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
  })
  test('PUT /:id', async () => {
    userSession.name = 'new name'
    userSession.imgs.push({...userSession.imgs[0], scale: 1.2, left: 5})
    const res = await api.put(`/api/sessions/${sess_id}`)
      .send(userSession)
      .expect(200)
      .expect('Content-type', /application\/json/)
    expect(_.omit(res.body,['id']))
      .toEqual(userSession);
  })
  test('DELETE /:id', async () => {
    await api.delete(`/api/sessions/${sess_id}`)
      .expect(204);
  })
  test('inexistent sessions', async () => {
    const url = '/api/sessions/123456789012345678901234'
    await api.get(url).expect(404)
    await api.delete(url).expect(404)
    await api.put(url).send(userSession).expect(404)
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

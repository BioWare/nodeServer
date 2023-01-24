import { log } from 'console'
import { title } from 'process'
import request from 'supertest'
import { app, HTTP_STATUSES } from '../../src'

describe('/courses', () => {

  beforeAll( async () => {
    await request(app).delete('/__test__/data')
  })

  it('shoud return 200 and empty array', async () => {
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [])
  })


  it('shoud return 404 for not existing course', async () => {
    await request(app)
      .get('/courses/10')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('shoudn\'t create course with incorrect data', async () => {
    await request(app)
      .post('/courses')
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)


    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('shoud create course with given data', async () => {
    const createResponse = await request(app)
      .post('/courses')
      .send({ title: 'test_Data_science' })
      .expect(HTTP_STATUSES.CREATED_201)
    console.log(createResponse);
    
    //TODO get created element

  })

})

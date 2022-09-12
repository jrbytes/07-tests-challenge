import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection
let server: any

describe('Show User Profile Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
    server = app.listen()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
    server.close()
  })

  it('should be able to show user profile', async () => {
    const email = 'example@gmail.com'
    const password = '123456'

    await request(server).post('/api/v1/users').send({
      name: 'John Doe',
      email,
      password,
    })

    const responseToken = await request(server).post('/api/v1/sessions').send({
      email,
      password,
    })

    const responseUser = await request(server).get('/api/v1/profile')
      .send()
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    expect(responseUser.status).toBe(200)
  })
})

import request from 'supertest'

import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection:Connection
let server: any

describe('Authenticate User Controller', () => {
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

  it('should be able to authenticate an user', async () => {
    const email = 'example@gmail.com'
    const password = '123456'

    await request(server).post('/api/v1/users').send({
      name: 'John Doe',
      email,
      password,
    })

    const responseAuthenticate = await request(server).post('/api/v1/sessions').send({
      email,
      password,
    })

    expect(responseAuthenticate.status).toBe(200)
    expect(responseAuthenticate.body).toHaveProperty('token')
    expect(responseAuthenticate.body.user).toHaveProperty('name')
  })
})

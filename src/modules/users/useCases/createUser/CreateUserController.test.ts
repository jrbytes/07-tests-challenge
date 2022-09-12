import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection
let server: any

describe('Create User Controller', () => {
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

  it('should be able to create an user', async () => {
    const responseUser = await request(server).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'example@gmail.com',
      password: '123456',
    })

    expect(responseUser.status).toBe(201)
  })
})

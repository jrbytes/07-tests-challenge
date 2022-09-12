import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection
let server: any

describe('Get Statement Operation Controller', () => {
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

  it('should be able to list a balance', async () => {
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

    const responseDeposit = await request(server)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'deposit to the car',
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    const responseBalance = await request(server).get(
      `/api/v1/statements/${responseDeposit.body.id}`
    )
      .send()
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    expect(responseBalance.status).toBe(200)
  })
})

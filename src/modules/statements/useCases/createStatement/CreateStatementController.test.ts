import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '../../../../app'

let connection: Connection
let server: any

describe('Statement Controller', () => {
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

  it('should be able to create a statement deposit', async () => {
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

    const responseDeposit = await request(server).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'deposit to the car'
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    expect(responseDeposit.status).toBe(201)
  })

  it('should be able to create a statement withdraw', async () => {
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

    await request(server).post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'deposit to the car'
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    const responseWithdraw = await request(server).post('/api/v1/statements/withdraw')
      .send({
        amount: 80,
        description: 'deposit to the car'
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    expect(responseWithdraw.status).toBe(201)
  })
})

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUser: CreateUserUseCase
let authenticateUser: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUser = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUser = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to authenticate an user', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'example@gmail.com',
      password: '123456'
    })

    const authenticate = await authenticateUser.execute({
      email: 'example@gmail.com',
      password: '123456'
    })

    expect(authenticate).toHaveProperty('token')
  })

  it('should not be able to authenticate the user if non-existent an user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'email',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it('should not be able to authenticate the user if non-existent an user', async () => {
    const email = 'example@example.com'
    const password = '123456'

    await createUser.execute({
      name: 'John Doe',
      email,
      password
    })

    await expect(
      authenticateUser.execute({
        email,
        password: 'other-password',
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})

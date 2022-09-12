import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUser: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create an user', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to show the profile of a non-existent user', async () => {
    const email = 'test@example.com'

    await createUser.execute({
      name: 'User Test',
      email: email,
      password: '123456',
    })

    await expect(
      createUser.execute({
        name: 'User Test Error',
        email: email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  })
})

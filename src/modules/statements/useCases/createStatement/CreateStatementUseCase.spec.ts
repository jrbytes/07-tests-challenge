import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatement: CreateStatementUseCase;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatement = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  })

  it('should be able to create a statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    const statement = await createStatement.execute({
      amount: 100,
      description: 'Test',
      type: 'deposit' as any,
      user_id: user.id as string,
    })

    expect(statement).toHaveProperty('id');
  })

  it('should not be able if nonexistent an user', async () => {
    await expect(
      createStatement.execute({
        amount: 100,
        description: 'Test',
        type: 'deposit' as any,
        user_id: '123456',
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it('should be able to create a statement if has funds', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    await createStatement.execute({
      amount: 100,
      description: 'Test',
      type: 'deposit' as any,
      user_id: user.id as string,
    })

    await inMemoryStatementsRepository.getUserBalance({
      user_id: user.id as string
    });

    await expect(
      createStatement.execute({
        amount: 110,
        description: 'Test',
        type: 'withdraw' as any,
        user_id: user.id as string,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})

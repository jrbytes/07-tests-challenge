import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperation: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperation = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  })

  it('should be able to create a statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      type: 'deposit' as any,
      amount: 100,
      description: 'Test',
    })

    const statementOperation = await getStatementOperation.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    })

    expect(statementOperation).toHaveProperty('id');
  })

  it('should not be able if nonexistent an user', async () => {
    await expect(
      getStatementOperation.execute({
        statement_id: '123456',
        user_id: '123456',
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it('should not be able to create a statement operation without a statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    await expect(
      getStatementOperation.execute({
        statement_id: 'without statement',
        user_id: user.id as string,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})

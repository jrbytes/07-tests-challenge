import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalance: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalance = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository,
    );
  })

  it('should be able to create a statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    const balance = await getBalance.execute({
      user_id: user.id as string,
    })

    expect(balance).toHaveProperty('statement');
  })

  it('should not be able if nonexistent an user', async () => {
    await expect(
      getBalance.execute({
        user_id: '123456',
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  })
})

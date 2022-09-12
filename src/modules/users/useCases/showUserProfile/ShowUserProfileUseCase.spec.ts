import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfile: ShowUserProfileUseCase;

describe('Show Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it('should be able to show the user profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'User Test',
      email: '123456',
      password: '123456',
    })

    const profile = await showUserProfile.execute(user.id as string)

    expect(profile).toHaveProperty('id')
  })

  it('should not be able to show the profile of a non-existent user', async () => {
    await expect(
      showUserProfile.execute('non-existent user')
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})

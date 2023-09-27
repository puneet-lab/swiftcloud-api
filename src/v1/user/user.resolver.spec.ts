import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

jest.mock('./user.service');

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get(UserService);
  });

  describe('getToken', () => {
    it('should return a token', async () => {
      const result = 'a-valid-token';
      userService.generateToken.mockResolvedValue(result);

      expect(await userResolver.getToken('michael')).toBe(result);
    });

    it('should throw an error if username is not "michael"', async () => {
      userService.generateToken.mockImplementation(() => {
        throw new Error('Invalid username, please use test user "michael"');
      });

      await expect(userResolver.getToken('not-michael')).rejects.toThrow(
        'Invalid username, please use test user "michael"',
      );
    });
  });
});

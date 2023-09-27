import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../shared/song/dto/user.entity';
import { UserService } from './user.service';

const mockRepository = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('generateToken', () => {
    it('should return a token if username is "michael"', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1, username: 'michael' });
      mockJwtService.sign.mockReturnValue('a-valid-token');

      expect(await userService.generateToken('michael')).toBe('a-valid-token');
    });

    it('should throw an error if username is not "michael"', async () => {
      await expect(userService.generateToken('not-michael')).rejects.toThrow(
        'Invalid username, please use test user "michael"',
      );
    });

    it('should throw an error if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(userService.generateToken('michael')).rejects.toThrow(
        'User not found',
      );
    });
  });
});

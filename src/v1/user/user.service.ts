import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/song/dto/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async generateToken(username: string): Promise<string> {
    if (username !== 'michael') {
      throw new Error('Invalid username, please use test user "michael"');
    }
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}

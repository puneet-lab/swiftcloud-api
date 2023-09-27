import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { User } from '../../shared/song/dto/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'michael',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [UserService, UserResolver, JwtStrategy, JwtAuthGuard],
  exports: [UserService, JwtAuthGuard],
})
export class UserModule {}

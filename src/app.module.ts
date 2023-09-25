import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlModule } from './gql/gql.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [GqlModule, SongModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

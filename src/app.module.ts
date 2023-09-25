import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import developmentConfig from './config/development.config';
import productionConfig from './config/production.config';
import stagingConfig from './config/staging.config';
import { GqlModule } from './gql/gql.module';
import { SongModule } from './song/song.module';

const environment = process.env.NODE_ENV || 'development';

const configurations = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};
const envConfig = configurations[environment];

@Module({
  imports: [
    GqlModule,
    SongModule,
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

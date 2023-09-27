import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import developmentConfig from './config/development.config';
import productionConfig from './config/production.config';
import stagingConfig from './config/staging.config';
import { PostgresModule } from './database/postgres/postgres.module';
import { GqlV1Module } from './gql/gqlV1.module';
import { UserModule } from './v1/user/user.module';
import { V1Module } from './v1/v1.module';

const environment = process.env.NODE_ENV || 'development';

const configurations = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};
const envConfig = configurations[environment];

@Module({
  imports: [
    GqlV1Module,
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    PostgresModule,
    V1Module,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

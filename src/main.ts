import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ParseClassesPipe } from './shared/pipe/parse-classes.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ParseClassesPipe());
  await app.listen(3000);
}
bootstrap();

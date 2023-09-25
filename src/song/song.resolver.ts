import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class SongResolver {
  @Query(() => String)
  async getHelloWorld(): Promise<string> {
    return 'Hello World';
  }
}

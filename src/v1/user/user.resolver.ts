import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String, {
    description:
      'Retrieve a token for accessing protected user routes. Currently, a test user "michael" is available for obtaining a token. Please use the username "michael" to generate a token.',
  })
  async getToken(
    @Args('username', {
      description:
        'The username of the user, currently only "michael" is available for testing.',
    })
    username: string,
  ): Promise<string> {
    return this.userService.generateToken(username);
  }
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDTO {
  @Field({ description: 'The unique identifier of the user.' })
  id: string;

  @Field({ description: 'The username of the user.' })
  username: string;

  @Field({ description: 'The name of the user.' })
  name: string;

  @Field({ description: 'The date and time when the user was created.' })
  createdAt: Date;

  @Field({ description: 'The date and time when the user was last updated.' })
  updatedAt: Date;
}

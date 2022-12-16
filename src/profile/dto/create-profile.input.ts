import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateOwnProfileInput } from './create-own-profile.input';

@InputType()
export class CreateProfileInput extends CreateOwnProfileInput {
  @Field(() => Int)
  userId: number
}

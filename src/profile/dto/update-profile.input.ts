import { CreateProfileInput } from './create-profile.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { UpdateOwnProfileInput } from './update-own-profile.input';

@InputType()
export class UpdateProfileInput extends PartialType(UpdateOwnProfileInput) {
  @Field(() => Int)
  userId: number
}

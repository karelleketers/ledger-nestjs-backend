import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AdjustedUserInput {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  profileId: number

  @Field()
  bank: string;
}
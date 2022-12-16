import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class LoadMoreInput {
  @Field(() => Int)
  limit: number

  @Field(() => Int)
  offset: number
}
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AdjustSavingsInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Boolean)
  incoming: boolean;
}
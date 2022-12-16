import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AssignInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Boolean)
  incoming: boolean;

  @Field(() => Int)
  savingsId: number;
}
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class BalanceInput {
  @Field(() => Int, {nullable: true})
  current: number;
}

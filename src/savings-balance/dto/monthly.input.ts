import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class MonthlyInput {
  @Field(() => Int)
  id: number;

  @Field()
  monthly_savings: string;
}
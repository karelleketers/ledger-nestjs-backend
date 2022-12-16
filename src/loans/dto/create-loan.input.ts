import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateLoanInput {
  @Field()
  invite: string;

  @Field(() => Int)
  amount: number;

  @Field({defaultValue: false})
  paid?: boolean;

  @Field()
  owed: boolean;

  @Field({nullable: true})
  reason: string;
}

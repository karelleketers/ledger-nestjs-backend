import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBillInput {
  @Field()
  name: string;

  @Field(() => Int, {nullable: true})
  amount: number;
}

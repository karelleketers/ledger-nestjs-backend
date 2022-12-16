import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateSavingsInput {
  @Field()
  name: string;

  @Field(() => Int, {nullable: true})
  goal: number;

  @Field(() => Date, {nullable: true})
  goal_date?: Date;

  @Field(() => Int, {nullable: true})
  amount?: number;

  @Field({nullable: true})
  type?: string;
}

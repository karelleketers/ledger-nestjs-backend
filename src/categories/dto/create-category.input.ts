import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field(() => Int, {nullable: true})
  total: number;

  @Field({defaultValue: false, nullable: true})
  hidden: boolean

  @Field(() => Int, {nullable: true})
  categoryIconId: number

  @Field(() => Int)
  current: number;
}

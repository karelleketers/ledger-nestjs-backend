import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionnaireInput {
  @Field(() => Int)
  ageGroup?: number;

  @Field()
  improve?: string;

  @Field()
  savedLastMonth?: boolean;

  @Field()
  goal?: boolean;

  @Field(() => Int, {nullable: true})
  balance?: number;

  @Field(() => Int, {nullable: true})
  savings?: number;
}

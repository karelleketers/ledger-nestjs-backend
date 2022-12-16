import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOwnProfileInput {
  @Field({defaultValue: true})
  reminder: boolean

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({defaultValue: "initialised"})
  onboarding: string;
}
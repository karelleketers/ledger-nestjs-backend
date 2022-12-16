import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOwnProfileInput {
  @Field({nullable: true})
  firstName?: string;

  @Field({nullable: true})
  lastName?: string;

  @Field({nullable: true})
  bank?: string;

  @Field({nullable: true})
  reminder?: boolean
}
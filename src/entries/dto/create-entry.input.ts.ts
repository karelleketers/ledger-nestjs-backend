import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEntryInput {
  @Field()
  incoming: boolean;

  @Field(() => Int)
  amount: number;

  @Field(() => Int, {nullable: true})
  categoryId?: number;

  @Field({nullable: true})
  category: string;

  @Field({nullable: true})
  description?: string;

  @Field({nullable: true})
  type?: string;
}

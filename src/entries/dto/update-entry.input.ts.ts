import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateEntryInput } from './create-entry.input.ts';

@InputType()
export class UpdateEntryInput extends CreateEntryInput {
  @Field(() => Int)
  id: number;
}

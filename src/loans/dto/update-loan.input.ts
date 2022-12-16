import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateLoanInput } from './create-loan.input';

@InputType()
export class UpdateLoanInput extends CreateLoanInput {
  @Field(() => Int)
  id: number;
}

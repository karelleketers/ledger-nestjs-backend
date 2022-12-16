import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateBillInput } from './create-bill.input';

@InputType()
export class UpdateBillInput extends CreateBillInput{
  @Field()
  paid: boolean;

  @Field(() => Int)
  id: number;
}

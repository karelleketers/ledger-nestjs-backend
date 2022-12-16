import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateBillReminderInput {
  @Field()
  reminder: boolean;
}

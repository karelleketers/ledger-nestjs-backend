import { Field, InputType, Int } from "@nestjs/graphql";
import { CreateSavingsInput } from "./create-saving.input";

@InputType()
export class UpdateSavingsInput extends CreateSavingsInput{
  @Field(() => Int)
  id: number;
}

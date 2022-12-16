import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateDetailsInput {
    @Field()
    email?: string;

    @Field()
    password?: string;
}
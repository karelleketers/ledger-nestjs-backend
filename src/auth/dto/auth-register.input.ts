import { Field, InputType } from "@nestjs/graphql";
import { AuthInput } from "./auth.input";

@InputType()
export class AuthRegisterInput extends AuthInput {
    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field({defaultValue: "initialised"})
    onboarding: string;

    @Field({defaultValue: true})
    reminder: boolean
}
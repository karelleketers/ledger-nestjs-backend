import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput { //MAKE OPTIONAL
    @Field(() => Int)
    id: number;

    @Field()
    email?: string;

    @Field({defaultValue: false})
    isAdmin?: boolean;
}
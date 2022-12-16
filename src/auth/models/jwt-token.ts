import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JwtToken {
    @Field(() => String)
    token: string
}
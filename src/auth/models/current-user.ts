import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CurrentUser {
    @Field(() => Int)
    id: number

    @Field()
    email: string

    @Field()
    isAdmin: boolean

    @Field(() => Int)
    profileId: number
}
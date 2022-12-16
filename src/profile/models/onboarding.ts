import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class OnBoarding {
    @Field(() => String)
    onboarding: string
}
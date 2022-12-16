import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Savings } from "../entities/saving.entity";

@ObjectType()
export class SavingsAndCount {

    @Field(() => [Savings], {nullable: true})
    items: Savings[]

    @Field(() => Int, {nullable: true})
    count: number
}
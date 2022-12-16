import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Bill } from "../entities/bill.entity";

@ObjectType()
export class BillsAndCount {
    @Field(() => [Bill], {nullable: true})
    items: Bill[]

    @Field(() => Int, {nullable: true})
    count: number

    @Field(() => Int, {nullable: true})
    unpaidCount: number
}
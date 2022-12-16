import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UsersLoan } from "../entities/users-loan.entity";

@ObjectType()
export class LoansAndCount {

    @Field(() => [UsersLoan], {nullable: true})
    items: UsersLoan[]

    @Field(() => Int, {nullable: true})
    count: number
}
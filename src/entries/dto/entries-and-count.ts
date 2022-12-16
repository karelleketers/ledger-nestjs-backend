import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Entry } from "src/entries/entities/entry.entity";

@ObjectType()
export class EntriesAndCount {

    @Field(() => [Entry], {nullable: true})
    items: Entry[]

    @Field(() => Int, {nullable: true})
    count: number
}
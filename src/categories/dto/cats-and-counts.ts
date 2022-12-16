import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";

@ObjectType()
export class CategoriesAndCount {

    @Field(() => [Category], {nullable: true})
    items: Category[]

    @Field(() => Int, {nullable: true})
    count: number
}
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/category.entity';
import { BaseModel } from 'src/models/base.model';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class CategoryIcon extends BaseModel{
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({unique: true})
  name: string;

  @OneToMany(() => Category, category => category.categoryIcon)
  @Field(() => [Category], {nullable: true})
  categories: Category[];
}

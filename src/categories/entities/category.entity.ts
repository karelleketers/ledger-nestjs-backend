import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CategoryIcon } from 'src/category-icons/entities/category-icon.entity';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Category extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  current: number;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  total: number;

  @Field()
  @Column({default: false})
  hidden: boolean;


  //update: false removed, nullable true added
  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  profileId: number

  //nullable true added
  @ManyToOne(() => Profile, profile => profile.categories, {onDelete: 'CASCADE', nullable: true})
  @Field(() => Profile, {nullable: true})
  profile: Profile

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  categoryIconId: number

  @ManyToOne(() => CategoryIcon, categoryIcon => categoryIcon.categories, {onDelete: "CASCADE", eager: true, cascade: true})
  @Field(() => CategoryIcon, {nullable: true})
  categoryIcon: CategoryIcon;
}

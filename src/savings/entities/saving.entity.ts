import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Savings extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  saved: number;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  goal: number;

  @Field(() => Date, {nullable: true})
  @Column({nullable: true})
  goal_date?: Date; //ARRANGE

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  amount?: number;

  @Field({nullable: true})
  @Column({nullable: true})
  type?: string;

  @Field(() => Boolean, {nullable: true})
  @Column({nullable: true, default: false})
  complete: boolean;

  //beware update was false before {update: false}
  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  profileId: number

  //BEWARE: this field and profileId field were not nullable before
  @ManyToOne(() => Profile, profile => profile.savings, {onDelete: 'CASCADE', nullable: true})
  @Field(() => Profile, {nullable: true})
  profile: Profile
}
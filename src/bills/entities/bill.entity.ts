import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Bill extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  amount: number;

  @Field()
  @Column({default: false})
  paid: boolean;

  @Field()
  @Column()
  reminder: boolean;

  @Field(() => Int, {nullable: true})
  //update: false removed, nullable: true added
  @Column({nullable: true})
  profileId: number

  @ManyToOne(() => Profile, profile => profile.bills, {onDelete: 'CASCADE', nullable: true})
  @Field(() => Profile, {nullable: true})
  profile: Profile
}
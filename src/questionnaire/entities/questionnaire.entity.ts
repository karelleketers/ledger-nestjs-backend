import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Questionnaire extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  ageGroup: number;

  @Field({nullable: true})
  @Column({nullable: true})
  improve: string;

  @Field({nullable: true})
  @Column({nullable: true})
  savedLastMonth: boolean;

  @Field({nullable: true})
  @Column({nullable: true})
  goal: boolean;

  //update: false removed, nullable: true added
  @Field({nullable: true})
  @Column({unique: true, nullable: true})
  profileId: number

  @OneToOne(() => Profile, profile => profile.questionnaire, {onDelete: 'CASCADE', nullable: true})
  @JoinColumn()
  @Field(() => Profile, {nullable: true})
  profile: Profile
}
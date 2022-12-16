import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Balance extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  current: number;

  @Field({nullable: true})
  //update: false removed, nullable: true added
  @Column({unique: true, nullable: true})
  profileId: number

  @OneToOne(() => Profile, profile => profile.balance, {onDelete: 'CASCADE', nullable: true})
  @JoinColumn()
  @Field(() => Profile, {nullable: true})
  profile: Profile
}
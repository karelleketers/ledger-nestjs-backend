import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { Profile } from 'src/profile/entities/profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Entry extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({nullable: true})
  incoming: boolean;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  amount: number;

  @Field({nullable: true})
  @Column({nullable: true})
  category?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  description?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  type?: string;

  //update: false removed, nullable: true added
  @Field({nullable: true})
  @Column({nullable: true})
  profileId: number

  @ManyToOne(() => Profile, profile => profile.entries, {onDelete: 'CASCADE', nullable: true})
  @Field(() => Profile, {nullable: true})
  profile: Profile
}

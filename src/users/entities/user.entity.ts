import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Profile } from 'src/profile/entities/profile.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';
import { BaseModel } from 'src/models/base.model';
import { Exclude } from 'class-transformer';
import { UsersLoan } from 'src/users-loans/entities/users-loan.entity';
import * as bcrypt from 'bcrypt';

@Entity()
@ObjectType()
export class User extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @BeforeInsert()
  emailToLowerCase() {
      this.email = this.email.toLowerCase();
  }
  @Field({nullable: true})
  @Column({unique: true, nullable: true})
  email: string;

  @Exclude()
  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(password || this.password, salt)
  }
  @Field({nullable: true})
  @Column({nullable: true})
  password: string;

  @Field({nullable: true})
  @IsOptional()
  @Column('boolean', {default: false})
  isAdmin?: boolean;

  @OneToOne(() => Profile, profile => profile.user, { onDelete: 'CASCADE', eager: true })
  @Field(() => Profile, {nullable: true})
  profile: Profile;

  @OneToMany(() => UsersLoan, usersloan => usersloan.user, {nullable: true})
  @Field(() => [UsersLoan], {nullable: true})
  userloans: UsersLoan[];
}

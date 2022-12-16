import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Loan } from 'src/loans/entities/loan.entity';
import { BaseModel } from 'src/models/base.model';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class UsersLoan extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  userId: number

  @ManyToOne(() => User, user => user.userloans, {onDelete: "CASCADE", eager: true, cascade: true, nullable: true})
  @Field(() => User, {nullable: true})
  user: User

  @Field(() => Int, {nullable: true})
  @Column({nullable: true})
  loanId: number

  @ManyToOne(() => Loan, loan => loan.userloans, {eager: true, nullable: true})
  @Field(() => Loan, {nullable: true})
  loan: Loan

  @Field({nullable: true})
  @Column({nullable: true})
  owed: boolean

  @Field({nullable: true})
  @Column({nullable: true})
  inviteName: string

  @Field({nullable: true})
  @Column({nullable: true})
  inviteEmail: string
}

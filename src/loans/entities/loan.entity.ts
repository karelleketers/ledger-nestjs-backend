import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseModel } from 'src/models/base.model';
import { UsersLoan } from 'src/users-loans/entities/users-loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Loan extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field()
  @Column({default: false})
  paid: boolean;

  @Field({nullable: true})
  @Column({nullable: true})
  reason: string;

  @OneToMany(() => UsersLoan, usersloan => usersloan.loan, {onDelete: "CASCADE", cascade: true, nullable: true})
  @Field(() => [UsersLoan], {nullable: true})
  userloans: UsersLoan[];
}

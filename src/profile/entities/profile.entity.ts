import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Balance } from 'src/balance/entities/balance.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Entry } from 'src/entries/entities/entry.entity';
import { BaseModel } from 'src/models/base.model';
import { Questionnaire } from 'src/questionnaire/entities/questionnaire.entity';
import { Savings } from 'src/savings/entities/saving.entity';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Profile extends BaseModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({nullable: true})
  @Column({nullable: true})
  firstName: string;

  @Field({nullable: true})
  @Column({nullable: true})
  lastName: string;

  @Field({nullable: true})
  @Column({nullable: true})
  bank: string;

  @Field()
  @Column({default: true})
  reminder: boolean;

  @Field({nullable: true})
  @Column({nullable: true})
  onboarding: string;

  @Field()
  @Column({unique: true, update: false})
  userId: number

  @OneToOne(() => User, user => user.profile,  { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => User)
  user: User

  @OneToOne(() => Questionnaire, questionnaire => questionnaire.profile, { eager: true })
  @Field(() => Questionnaire, {nullable: true})
  questionnaire: Questionnaire

  @OneToOne(() => Balance, balance => balance.profile, { eager: true })
  @Field(() => Balance, {nullable: true})
  balance: Balance

  @OneToOne(() => SavingsBalance, savingsBalance => savingsBalance.profile, { eager: true })
  @Field(() => SavingsBalance, {nullable: true})
  savingsBalance: SavingsBalance

  @OneToMany(() => Entry, entry => entry.profile, { eager: true })
  @Field(() => [Entry], {nullable: true})
  entries? : Entry[]

  @OneToMany(() => Category, category => category.profile, { eager: true })
  @Field(() => [Category], {nullable: true})
  categories? : Category[]

  @OneToMany(() => Savings, savings => savings.profile, { eager: true, nullable: true })
  @Field(() => [Savings], {nullable: true})
  savings? : Savings[]

  @OneToMany(() => Bill, bills => bills.profile, { eager: true })
  @Field(() => [Bill], {nullable: true})
  bills? : Bill[]
}

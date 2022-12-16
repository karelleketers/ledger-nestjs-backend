import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { UpdateLoanInput } from './dto/update-loan.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/enums/action.enum';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CreateLoanInput } from './dto/create-loan.input';
import { Id } from 'src/models/update.model';

@Resolver(() => Loan)
export class LoansResolver {
  constructor(private readonly loansService: LoansService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Loan)
  createLoan(@CtxUser() user: CurrentUser, @Args('input') createLoanInput: CreateLoanInput): Promise<Loan> {
    return this.loansService.createLoan(user.id, createLoanInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Loan])) 
  @Query(() => [Loan])
  loans(@CtxUser() user: CurrentUser): Promise<Loan[]>  {
    return this.loansService.findLoans();
  }

  /* @UseGuards(GqlAuthGuard)
  @Query(() => [Loan])
  getLoans(@CtxUser() user: CurrentUser): Promise<Loan[]> { //FIX
    return this.loansService.findAll(user.id);
  } */


  @UseGuards(GqlAuthGuard)
  @Mutation(() => Loan)
  updateLoan(@CtxUser() user: CurrentUser, @Args('input') updateLoanInput: UpdateLoanInput): Promise<Loan> {
    return this.loansService.updateLoan(user.id, updateLoanInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeLoan(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Id> {
    return this.loansService.removeLoan(id);
  }
}

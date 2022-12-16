import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SavingsBalanceService } from './savings-balance.service';
import { SavingsBalance } from './entities/savingsbalance.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { Id } from 'src/models/update.model';
import { MonthlyInput } from './dto/monthly.input';

@Resolver(() => SavingsBalance)
export class SavingsBalanceResolver {
  constructor(private readonly savingsBalanceService: SavingsBalanceService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => SavingsBalance)
  getSavingsBalance(@CtxUser() user: CurrentUser): Promise<SavingsBalance> {
    return this.savingsBalanceService.findOne(user.profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SavingsBalance)
  updateMonthlySavings(@CtxUser() user: CurrentUser, @Args('input') monthlyInput: MonthlyInput): Promise<SavingsBalance> {
    return this.savingsBalanceService.updateMonthlySavings(monthlyInput);
  }
}

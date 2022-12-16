import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SavingsService } from './savings.service';
import { Savings } from './entities/saving.entity';
import { CreateSavingsInput } from './dto/create-saving.input';
import { UpdateSavingsInput } from './dto/update-saving.input';
import { UseGuards } from '@nestjs/common';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/models/current-user';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/enums/action.enum';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Id } from 'src/models/update.model';
import { AssignInput } from 'src/savings-balance/dto/assign.input';
import { SavingsAndCount } from './dto/savings-and-count';
import { LoadMoreInput } from 'src/models/load-more.input';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';

@Resolver(() => Savings)
export class SavingsResolver {
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Savings)
  createSavings(@CtxUser() user: CurrentUser, @Args('input') createSavingsInput: CreateSavingsInput): Promise<Savings> {
    return this.savingsService.createSavings(user.profileId, createSavingsInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Savings])) 
  @Query(() => [Savings])
  savings(): Promise<Savings[]>  {
    return this.savingsService.findSavings();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [SavingsAndCount])
  async getAllSavings(@CtxUser() user: CurrentUser, @Args('results') loadMoreInput: LoadMoreInput): Promise<[SavingsAndCount]> {
    const [items, count] = await this.savingsService.findAll(user.profileId, loadMoreInput);
    return [{items, count}]
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Savings)
  getSavings(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Savings> {
    return this.savingsService.findOne(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Savings)
  updateSavings(@CtxUser() user: CurrentUser, @Args('input') updateSavingsInput: UpdateSavingsInput): Promise<Savings> {
    return this.savingsService.updateSavings(updateSavingsInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeSavings(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Id> {
    return this.savingsService.removeSavings(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SavingsBalance)
  assignSavings(@CtxUser() user: CurrentUser, @Args('input') assignInput: AssignInput): Promise<SavingsBalance> {
    return this.savingsService.assignSavings(user.profileId, assignInput);
  }
}

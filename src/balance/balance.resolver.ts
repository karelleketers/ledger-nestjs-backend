import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { Balance } from './entities/balance.entity';
import { BalanceService } from './balance.service';


@Resolver(() => Balance)
export class BalanceResolver {
  constructor(private readonly balanceService: BalanceService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Balance)
  getBalance(@CtxUser() user: CurrentUser): Promise<Balance> {
    return this.balanceService.findOne(user.profileId);
  }
}

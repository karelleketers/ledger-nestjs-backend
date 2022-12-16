import { Resolver, Query, Args, } from '@nestjs/graphql';
import { UsersLoansService } from './users-loans.service';
import { UsersLoan } from './entities/users-loan.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { LoadMoreInput } from 'src/models/load-more.input';
import { LoansAndCount } from './dto/loans-and-count';

@Resolver(() => UsersLoan)
export class UsersLoansResolver {
  constructor(private readonly usersLoansService: UsersLoansService) {}
  
  @UseGuards(GqlAuthGuard)
  @Query(() => [LoansAndCount])
  async getLoans(@CtxUser() user: CurrentUser, @Args('results') loadMoreInput: LoadMoreInput): Promise<[LoansAndCount]> {
    const [items, count] = await this.usersLoansService.findAll(user.id, loadMoreInput);
    return [{items, count}]
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UsersLoan)
  getLoan(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<UsersLoan> {
    return this.usersLoansService.findOne(id)
  }
}

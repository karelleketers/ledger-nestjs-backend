import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BillsService } from './bills.service';
import { Bill } from './entities/bill.entity';
import { CreateBillInput } from './dto/create-bill.input';
import { UpdateBillInput } from './dto/update-bill.input';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { Action } from 'src/casl/enums/action.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Id } from 'src/models/update.model';
import { BillsAndCount } from './dto/bills-and-count';
import { LoadMoreInput } from 'src/models/load-more.input';

@Resolver(() => Bill)
export class BillsResolver {
  constructor(private readonly billsService: BillsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bill)
  createBill(@CtxUser() user: CurrentUser, @Args('input') createBillInput: CreateBillInput): Promise<Bill> {
    return this.billsService.createBill(user.id, createBillInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Bill])) 
  @Query(() => [Bill])
  bills(): Promise<Bill[]>  {
    return this.billsService.findBills();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BillsAndCount])
  async getBills(@CtxUser() user: CurrentUser, @Args('results') loadMoreInput: LoadMoreInput): Promise<[BillsAndCount]> {
    const [items, count, unpaidCount] = await this.billsService.findBillsAndCount(user.profileId, user.id, loadMoreInput);
    return [{items, count, unpaidCount}]
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Bill)
  getBill(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Bill> {
    return this.billsService.findOne(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Bill])
  getUnpaidBills(@CtxUser() user: CurrentUser): Promise<Bill[]> {
    return this.billsService.getUnpaidBills(user.profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bill)
  updateBill(@CtxUser() user: CurrentUser, @Args('input') updateBillInput: UpdateBillInput): Promise<Bill> {
    return this.billsService.updateBill(user.profileId, updateBillInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeBill(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Id> {
    return this.billsService.removeBill(user.profileId, id);
  }
  
}

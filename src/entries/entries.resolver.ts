import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EntriesService } from './entries.service';
import { Entry } from './entities/entry.entity';
import { CreateEntryInput } from './dto/create-entry.input.ts';
import { UpdateEntryInput } from './dto/update-entry.input.ts';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Action } from 'src/casl/enums/action.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Id } from 'src/models/update.model';
import { AdjustSavingsInput } from 'src/balance/dto/adjustsavings.input';
import { LoadMoreInput } from 'src/models/load-more.input';
import { EntriesAndCount } from 'src/entries/dto/entries-and-count';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';

@Resolver(() => Entry)
export class EntriesResolver {
  constructor(private readonly entriesService: EntriesService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Entry)
  createEntry(@CtxUser() user: CurrentUser, @Args('input') createEntryInput: CreateEntryInput): Promise<Entry> {
    return this.entriesService.createEntry(user.profileId, createEntryInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADD ARG!
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Entry])) 
  @Query(() => [Entry])
  entries(): Promise<Entry[]>  {
    return this.entriesService.findEntries();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [EntriesAndCount])
  async getEntries(@CtxUser() user: CurrentUser, @Args('results') loadMoreInput: LoadMoreInput): Promise<[EntriesAndCount]> {
    const [items, count] = await this.entriesService.findAll(user.profileId, loadMoreInput);
    return [{items, count}]
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Entry])
  getDashboardEntries(@CtxUser() user: CurrentUser): Promise<Entry[]> {
    return this.entriesService.findDashboardEntries(user.profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Entry)
  getEntry(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Entry> {
    return this.entriesService.findOne(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Entry)
  updateEntry(@CtxUser() user: CurrentUser, @Args('input') updateEntryInput: UpdateEntryInput): Promise<Entry> {
    return this.entriesService.updateEntry(user.profileId, updateEntryInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeEntry(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Id> {
    return this.entriesService.removeEntry(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SavingsBalance)
  updateSavingsEntry(@CtxUser() user: CurrentUser, @Args('input') adjustSavingsInput: AdjustSavingsInput): Promise<SavingsBalance> {
    return this.entriesService.updateSavingsEntry(user.profileId, adjustSavingsInput);
  }
}

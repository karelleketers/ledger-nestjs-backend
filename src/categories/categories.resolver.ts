import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/enums/action.enum';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Id } from 'src/models/update.model';
import { LoadMoreInput } from 'src/models/load-more.input';
import { CategoriesAndCount } from './dto/cats-and-counts';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  createCategory(@CtxUser() user: CurrentUser, @Args('input') createCategoryInput: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.createCategory(user.profileId, createCategoryInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Category])) 
  @Query(() => [Category])
  categories(): Promise<Category[]>  {
    return this.categoriesService.findCategories();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CategoriesAndCount])
  async getCategories(@CtxUser() user: CurrentUser, @Args('results') loadMoreInput: LoadMoreInput): Promise<[CategoriesAndCount]> {
    const [items, count] = await this.categoriesService.findAll(user.profileId, loadMoreInput);
    return [{items, count}]
  }

  

  @UseGuards(GqlAuthGuard)
  @Query(() => [Category])
  getCategoriesList(@CtxUser() user: CurrentUser): Promise<Category[]> {
    return this.categoriesService.findCategoriesList(user.profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Category)
  getCategory(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(user.profileId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Category)
  updateCategory(@CtxUser() user: CurrentUser, @Args('input') updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    return this.categoriesService.updateCategory(user.profileId, updateCategoryInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeCategory(@CtxUser() user: CurrentUser, @Args('id') id: number): Promise<Id> {
    return this.categoriesService.removeCategory(user.profileId, id);
  }
}

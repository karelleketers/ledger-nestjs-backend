import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/enums/action.enum';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CategoryIconsService } from './category-icons.service';
import { CategoryIcon } from './entities/category-icon.entity';

@Resolver(() => CategoryIcon)
export class CategoryIconsResolver {
  constructor(private readonly categoryIconsService: CategoryIconsService) {}

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.create, CategoryIcon))
  @Mutation(() => CategoryIcon)
  createCategoryIcon(@Args('name') name: string) {
    return this.categoryIconsService.createCategoryIcon(name);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [CategoryIcon])
  categoryIcons(): Promise<CategoryIcon[]> {
    return this.categoryIconsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => CategoryIcon)
  getCategoryIcon(@Args('name') name: string): Promise<CategoryIcon> {
    return this.categoryIconsService.findOne(name);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.update, CategoryIcon))
  @Mutation(() => CategoryIcon)
  updateCategoryIcon(@Args('name') name: string) {
    return this.categoryIconsService.updateCategoryIcon(name);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.delete, CategoryIcon))
  @Mutation(() => CategoryIcon)
  removeCategoryIcon(@Args('name') name: string) {
    return this.categoryIconsService.removeCategoryIcon(name);
  }
}

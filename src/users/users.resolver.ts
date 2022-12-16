import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/enums/action.enum';
import { UpdateDetailsInput } from './dto/update-details.input';
import { CurrentUser } from 'src/auth/models/current-user';
import { CreateUserInput } from './dto/create-user.input';
import { Id } from 'src/models/update.model';


@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private caslAbilityFactory: CaslAbilityFactory) {}

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [User]))
  @Query(() => [User])
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, User))
  @Query(() => User)
  getUser(@CtxUser() user: CurrentUser, @Args('email') email: string): Promise<User> {
      return this.usersService.findByEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  getDetails(@CtxUser() user: CurrentUser): Promise<User> {
      return this.usersService.findOne(user.id)
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.create, User))
  @Mutation(() => User)
  createUser(@CtxUser() user: CurrentUser, @Args('input') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.update, User))
  @Mutation(() => User)
  updateUser(@CtxUser() user: CurrentUser, @Args('input') updateUserInput: UpdateUserInput): Promise<User> {
    return this.usersService.updateUser(updateUserInput.id, updateUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  updateDetails(@CtxUser() user: CurrentUser, @Args('input') updateDetailsInput: UpdateDetailsInput): Promise<User> {
    return this.usersService.updateUser(user.id, updateDetailsInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Id)
  removeUser(@CtxUser() user: CurrentUser): Promise<Id> {
    return this.usersService.removeUser(user.id);
  }

}


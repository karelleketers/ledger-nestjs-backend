import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { Action } from 'src/casl/enums/action.enum';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { UpdateOwnProfileInput } from './dto/update-own-profile.input';
import { CurrentUser } from 'src/auth/models/current-user';
import { CreateProfileInput } from './dto/create-profile.input';
import { OnBoarding } from './models/onboarding';
import { Id } from 'src/models/update.model';
import { AdjustedUserInput } from './dto/adusted-user.input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Profile]))
  @Query(() => [Profile])
  profiles(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, Profile))
  @Query(() => Profile)
  getProfile(@CtxUser() user: CurrentUser, @Args('userId', { type: () => Int }) userId: number): Promise<Profile> {
    return this.profileService.findOne(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Profile)
  getOwnProfile(@CtxUser() user: CurrentUser): Promise<Profile> {
    return this.profileService.findOne(user.id);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY, BACKUP
  @CheckPolicies((ability: AppAbility) => ability.can(Action.create, Profile))
  @Mutation(() => Profile)
  createProfile(@CtxUser() user: CurrentUser, @Args('input') input: CreateProfileInput): Promise<Profile> {
    const {userId, ...createInput} = input;
    return this.profileService.createProfile(userId, createInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.update, Profile))
  @Mutation(() => Profile)
  updateProfile(@CtxUser() user: CurrentUser, @Args('input') updateProfileInput: UpdateProfileInput): Promise<Profile> {
    return this.profileService.updateProfile(updateProfileInput.userId, updateProfileInput);
  }

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.update, Profile))
  @Mutation(() => Profile)
  updateUserDetails(@CtxUser() user: CurrentUser, @Args('input') profileInput: AdjustedUserInput): Promise<Profile> {
    return this.profileService.updateUserDetails(profileInput.profileId, profileInput.bank);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Profile)
  updateOwnProfile(@CtxUser() user: CurrentUser, @Args('input') updateOwnProfileInput: UpdateOwnProfileInput): Promise<Profile> {
    return this.profileService.updateProfile(user.id, updateOwnProfileInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OnBoarding)
  skipQuestionnaire(@CtxUser() user: CurrentUser): Promise<OnBoarding> {
    return this.profileService.skipQuestionnaire(user.profileId);
  }
}

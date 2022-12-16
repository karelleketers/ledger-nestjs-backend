import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionnaireService } from './questionnaire.service';
import { Questionnaire } from './entities/questionnaire.entity';
import { UpdateQuestionnaireInput } from './dto/update-questionnaire.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/enums/action.enum';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { CurrentUser } from 'src/auth/models/current-user';
import { Id } from 'src/models/update.model';

@Resolver(() => Questionnaire)
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @UseGuards(GqlAuthGuard, PoliciesGuard) //ADMIN ONLY
  @CheckPolicies((ability: AppAbility) => ability.can(Action.read, [Questionnaire]))
  @Query(() => [Questionnaire])
  questionnaires(): Promise<Questionnaire[]> {
    return this.questionnaireService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Questionnaire)
  getQuestionnaire(@CtxUser() user: CurrentUser): Promise<Questionnaire> {
    return this.questionnaireService.findOne(user.profileId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Questionnaire)
  updateQuestionnaire(@CtxUser() user: CurrentUser, @Args('input') updateQuestionnaireInput: UpdateQuestionnaireInput): Promise<Questionnaire> {
    return this.questionnaireService.updateQuestionnaire(user.id, user.profileId, updateQuestionnaireInput);
  }

}

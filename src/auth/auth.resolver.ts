import { Args, Context, Mutation, Query, Resolver} from "@nestjs/graphql";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { AuthInput } from "./dto/auth.input";
import { JwtToken } from "./models/jwt-token";
import { UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CtxUser } from "./decorators/ctx-user.decorator";
import { User } from "src/users/entities/user.entity";
import { GqlAuthGuard } from "./guards/gql-auth.guard";
import { CurrentUser } from "./models/current-user";
import { ProfileService } from "src/profile/profile.service";
import { BalanceService } from "src/balance/balance.service";
import { AuthRegisterInput } from "./dto/auth-register.input";
import { SavingsBalanceService } from "src/savings-balance/savings-balance.service";
import { QuestionnaireService } from "src/questionnaire/questionnaire.service";

@Resolver()
export class AuthResolver {
    constructor( private readonly authService: AuthService, private readonly usersService: UsersService, private readonly profileService: ProfileService, private readonly balanceService: BalanceService, private readonly savingsBalanceService: SavingsBalanceService, private readonly questionnaireService: QuestionnaireService) {}

    @UseGuards(LocalAuthGuard)
    @Mutation(() => JwtToken)
    async login(@Context() context: any, @Args('loginInput') input: AuthInput): Promise<JwtToken>{
        return this.authService.login(context.req.user);
    }

    @Mutation(() => JwtToken)
    @UseGuards(GqlAuthGuard)
    refreshToken(@CtxUser() user: CurrentUser): Promise<JwtToken> {
        return this.authService.refreshToken(user.id);
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    whoAmI(@CtxUser() user: CurrentUser) {
    return this.usersService.findByEmail(user.email);
    }

    @Mutation(() => User)
    async register(@Args('registerInput') input: AuthRegisterInput): Promise<User> {
        const registeredUser =  await this.authService.register(input);
        const createdProfile = await this.profileService.createProfile(registeredUser.id, input);
        await this.balanceService.createBalance(createdProfile.id);
        await this.savingsBalanceService.createSavingsBalance(createdProfile.id);
        await this.questionnaireService.createQuestionnaire(createdProfile.id);
        return registeredUser;
    }   
}
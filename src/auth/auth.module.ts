import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BalanceModule } from 'src/balance/balance.module';
import { ProfileModule } from 'src/profile/profile.module';
import { QuestionnaireModule } from 'src/questionnaire/questionnaire.module';
import { SavingsBalanceModule } from 'src/savings-balance/savings-balance.module';
import { UsersModule } from 'src/users/users.module';
import { AuthHelper } from './auth.helper';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, ProfileModule, BalanceModule, SavingsBalanceModule, QuestionnaireModule, PassportModule, JwtModule.register({secret: process.env.JWT_KEY , signOptions: { expiresIn: '30m'}})],
  providers: [AuthService, AuthHelper, LocalStrategy, JwtStrategy, AuthResolver],
})
export class AuthModule {}

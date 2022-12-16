import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireResolver } from './questionnaire.resolver';
import { Questionnaire } from './entities/questionnaire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from 'src/profile/profile.module';
import { CaslModule } from 'src/casl/casl.module';
import { SavingsBalanceModule } from 'src/savings-balance/savings-balance.module';
import { BalanceModule } from 'src/balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire]), ProfileModule, CaslModule, BalanceModule, SavingsBalanceModule],
  providers: [QuestionnaireResolver, QuestionnaireService],
  exports: [QuestionnaireService]
})
export class QuestionnaireModule {}

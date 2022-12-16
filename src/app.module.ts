import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from 'ormconfig'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { EntriesModule } from './entries/entries.module';
import { CategoriesModule } from './categories/categories.module';
import { SavingsModule } from './savings/savings.module';
import { BalanceModule } from './balance/balance.module';
import { CategoryIconsModule } from './category-icons/category-icons.module';
import { BillsModule } from './bills/bills.module';
import { LoansModule } from './loans/loans.module';
import { UsersLoansModule } from './users-loans/users-loans.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { SavingsBalanceModule } from './savings-balance/savings-balance.module';

@Module({
  imports: [GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    playground: true,
    debug: true,
    installSubscriptionHandlers: true,
    introspection: true,
    buildSchemaOptions: {
      dateScalarMode: 'timestamp',
    },
    context: ({req}) => ({req})
  }),
  ScheduleModule.forRoot()
  ,
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot(ormconfig), UsersModule, ProfileModule, AuthModule, QuestionnaireModule, EntriesModule, CategoriesModule, SavingsModule, BalanceModule, CategoryIconsModule, BillsModule, LoansModule, UsersLoansModule, SavingsBalanceModule],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}

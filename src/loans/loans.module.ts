import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansResolver } from './loans.resolver';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { Loan } from './entities/loan.entity';
import { UsersLoansModule } from 'src/users-loans/users-loans.module';
import { BalanceModule } from 'src/balance/balance.module';
import { EntriesModule } from 'src/entries/entries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]), UsersModule, BalanceModule, CaslModule, UsersLoansModule, EntriesModule],
  providers: [LoansResolver, LoansService]
})
export class LoansModule {}

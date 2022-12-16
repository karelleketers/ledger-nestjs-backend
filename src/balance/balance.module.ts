import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceResolver } from './balance.resolver';
import { Balance } from './entities/balance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { SavingsBalanceModule } from 'src/savings-balance/savings-balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Balance]), CaslModule, SavingsBalanceModule],
  providers: [BalanceResolver, BalanceService],
  exports: [BalanceService]
})
export class BalanceModule {}

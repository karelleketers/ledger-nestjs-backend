import { Module } from '@nestjs/common';
import { SavingsBalanceService } from './savings-balance.service';
import { SavingsBalanceResolver } from './savings-balance.resolver';
import { SavingsBalance } from './entities/savingsbalance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsBalance]), CaslModule],
  providers: [SavingsBalanceResolver, SavingsBalanceService],
  exports: [SavingsBalanceService]
})
export class SavingsBalanceModule {}

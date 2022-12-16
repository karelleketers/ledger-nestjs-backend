import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsResolver } from './savings.resolver';
import { Savings } from './entities/saving.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { ProfileModule } from 'src/profile/profile.module';
import { SavingsBalanceModule } from 'src/savings-balance/savings-balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Savings]), ProfileModule, CaslModule, SavingsBalanceModule],
  providers: [SavingsResolver, SavingsService]
})
export class SavingsModule {}

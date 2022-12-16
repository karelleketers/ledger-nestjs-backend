import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesResolver } from './entries.resolver';
import { CaslModule } from 'src/casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { BalanceModule } from 'src/balance/balance.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entry]), CategoriesModule, BalanceModule, CaslModule],
  providers: [EntriesResolver, EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}

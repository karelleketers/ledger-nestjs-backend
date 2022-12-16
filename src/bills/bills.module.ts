import { forwardRef, Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsResolver } from './bills.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { Bill } from './entities/bill.entity';
import { EntriesModule } from 'src/entries/entries.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => ProfileModule), CaslModule, EntriesModule],
  providers: [BillsResolver, BillsService],
  exports: [BillsService]
})
export class BillsModule {}

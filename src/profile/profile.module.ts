import { forwardRef, Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UsersModule } from 'src/users/users.module';
import { CaslModule } from 'src/casl/casl.module';
import { BillsModule } from 'src/bills/bills.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersModule, CaslModule, forwardRef(() => BillsModule)],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}

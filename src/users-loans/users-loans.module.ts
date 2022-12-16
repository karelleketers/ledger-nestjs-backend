import { Module } from '@nestjs/common';
import { UsersLoansService } from './users-loans.service';
import { UsersLoansResolver } from './users-loans.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersLoan } from './entities/users-loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersLoan])],
  providers: [UsersLoansResolver, UsersLoansService],
  exports: [UsersLoansService]
})
export class UsersLoansModule {}

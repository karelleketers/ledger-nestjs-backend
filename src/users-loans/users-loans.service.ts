import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadMoreInput } from 'src/models/load-more.input';
import { Repository } from 'typeorm';
import { UsersLoan } from './entities/users-loan.entity';

@Injectable()
export class UsersLoansService {
  constructor(@InjectRepository(UsersLoan) private usersLoansRepository: Repository<UsersLoan>) {}
  createUsersLoan(userId: number, loanId: number, owed: boolean, inviteEmail: string, inviteName: string): Promise<UsersLoan> {
    try {
      const newUsersLoan = this.usersLoansRepository.create({userId, loanId, owed, inviteEmail, inviteName})
      return this.usersLoansRepository.save(newUsersLoan);
    } catch (err) {
      throw err
    }
  }

  findAll(userId: number, loadMoreInput: LoadMoreInput): Promise<[UsersLoan[], number]> {
    try {
      return this.usersLoansRepository.findAndCount({where:{userId}, take: loadMoreInput.limit, skip: loadMoreInput.offset, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  async findOne(id: number): Promise<UsersLoan> {
    try {
      const userLoan = await this.usersLoansRepository.findOne(id)
      return userLoan
    } catch (err) {
      throw err
    } 
  }

  async removeUserLoans(loanId: number): Promise<{loanId}> {
    try {
      const userLoansToRemove = await this.usersLoansRepository.find({loanId});
      userLoansToRemove.map(async (userLoan) => {
        await this.usersLoansRepository.remove(userLoan);
      })
      return {
        loanId: loanId
      }
    } catch (err) {
      throw err
    } 
  }
}

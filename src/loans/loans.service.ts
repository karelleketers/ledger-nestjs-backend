import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { EntriesService } from 'src/entries/entries.service';
import { Id } from 'src/models/update.model';
import { UsersLoansService } from 'src/users-loans/users-loans.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateLoanInput } from './dto/create-loan.input';
import { UpdateLoanInput } from './dto/update-loan.input';
import { Loan } from './entities/loan.entity';

@Injectable()
export class LoansService {
  constructor(@InjectRepository(Loan) private loansRepository: Repository<Loan>, private readonly usersLoansService: UsersLoansService, private readonly usersService: UsersService, private readonly balanceService: BalanceService, private readonly entriesService: EntriesService) {}

  async createLoan(userId, loanInput: CreateLoanInput): Promise<Loan> {
    try {
      //destruct input into 2nd party, recipient/donee, other info
    const { invite, owed, ...loan } = loanInput
    //find 2nd party
    const invited = await this.usersService.findByEmail(invite);
    const invitee = await this.usersService.findOne(userId);
    if (!invited) {throw Error ("user does not exist")}
    //create and save loan based on input
    const newLoan = await this.loansRepository.create(loan);
    const createdLoan = await this.loansRepository.save(newLoan);
    //create user_loan for both recipient and donee with referral to loan
    const invitedName = `${invited.profile.firstName} ${(invited.profile.lastName).charAt(0)}.`
    const inviteeName = `${invitee.profile.firstName} ${(invitee.profile.lastName).charAt(0)}.`
    await this.usersLoansService.createUsersLoan(userId, newLoan.id, owed, invite, invitedName);
    await this.usersLoansService.createUsersLoan(invited.id, newLoan.id, !owed, invitee.email, inviteeName);
    //if loan is paid, adjust balance
    if (loan.paid) {
      //if invitee is owed, add amount to their balance and subtract from invited balance, and vice-versa
      if (owed) {
      const incoming = {incoming: true, amount: loanInput.amount, category: "loans", type: "loans", description: `from ${invitedName} ${loanInput.reason && `for ${loanInput.reason}`}`};
      const outgoing = {incoming: false, amount: loanInput.amount, category: "loans", type: "loans", description: `to ${inviteeName} ${loanInput.reason && `for ${loanInput.reason}`}`};
        this.entriesService.createEntry(invitee.profile.id, incoming);
        this.entriesService.createEntry(invited.profile.id, outgoing);
      } else if (!owed) {
        const incoming = {incoming: true, amount: loanInput.amount, category: "loans", type: "loans", description: `from ${inviteeName} ${loanInput.reason && `for ${loanInput.reason}`}`};
        const outgoing = {incoming: false, amount: loanInput.amount, category: "loans", type: "loans", description: `to ${invitedName} ${loanInput.reason && `for ${loanInput.reason}`}`};
        this.entriesService.createEntry(invited.profile.id, incoming);
        this.entriesService.createEntry(invitee.profile.id, outgoing);
      }
    }
    return createdLoan
    } catch (err) {
      throw err
    }
  }

  findLoans(): Promise<Loan[]> {
    try {
      return this.loansRepository.find({take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  async findOne(id: number): Promise<Loan> { //ADD WITH ID (from class)
    try {
      const loan = await this.loansRepository.findOne(id)
      return loan
    } catch (err) {
      throw err
    } 
  }

  async findByUserLoan(id: number): Promise<Loan> { //ADD WITH ID (from class)
    try {
      const userLoan = await this.usersLoansService.findOne(id)
      const loan = await this.loansRepository.findOne({id: userLoan.loanId})
      return loan
    } catch (err) {
      throw err
    } 
  }

  async updateLoan(userId: number, updateLoanInput: UpdateLoanInput): Promise<Loan> { //FIX! NEEDS NAME TO UPDATE, BUT CAN'T IF CHANGING NAME
    try {
      const {owed, invite, id, ...loanInput} = updateLoanInput;
      const loanToUpdate = await this.findByUserLoan(id);
      const updatedLoan = await this.loansRepository.preload({id: loanToUpdate.id, ...loanInput})
      if (!loanToUpdate.paid && updateLoanInput.paid) {
        const invitee = await this.usersService.findOne(userId);
        const invited = await this.usersService.findByEmail(invite)
        const invitedName = `${invited.profile.firstName} ${(invited.profile.lastName).charAt(0)}.`
        const inviteeName = `${invitee.profile.firstName} ${(invitee.profile.lastName).charAt(0)}.`
        //if invitee is owed, add amount to their balance and subtract from invited balance, and vice-versa
        if (owed) {
        const incoming = {incoming: true, amount: updateLoanInput.amount, category: "loans", description: `from ${invitedName} ${updateLoanInput.reason && `for ${updateLoanInput.reason}`}`};
        const outgoing = {incoming: false, amount: updateLoanInput.amount, category: "loans", description: `to ${inviteeName} ${updateLoanInput.reason && `for ${updateLoanInput.reason}`}`};
        this.entriesService.createEntry(invitee.profile.id, incoming);
        this.entriesService.createEntry(invited.profile.id, outgoing);
        } else if (!owed) {
        const incoming = {incoming: true, amount: updateLoanInput.amount, category: "loans", description: `from ${inviteeName} ${updateLoanInput.reason && `for ${updateLoanInput.reason}`}`};
        const outgoing = {incoming: false, amount: updateLoanInput.amount, category: "loans", description: `to ${invitedName} ${updateLoanInput.reason && `for ${updateLoanInput.reason}`}`};
        this.entriesService.createEntry(invited.profile.id, incoming);
        this.entriesService.createEntry(invitee.profile.id, outgoing);
        }
      }
      return this.loansRepository.save(updatedLoan)
    } catch (err) {
        throw err
      }
    }

    async removeLoan(id: number): Promise<Id> {
      try {
        const loanToRemove = await this.findByUserLoan(id);
        const idLoanToRemove = await this.usersLoansService.removeUserLoans(loanToRemove.id);
        const loanToBeRemoved = await this.findOne(idLoanToRemove.loanId);
        await this.loansRepository.remove(loanToBeRemoved);
        return {
          id: id,
        }
      } catch (err) {
        throw err
      }
    }
}

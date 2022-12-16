import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadMoreInput } from 'src/models/load-more.input';
import { Id } from 'src/models/update.model';
import { AssignInput } from 'src/savings-balance/dto/assign.input';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';
import { SavingsBalanceService } from 'src/savings-balance/savings-balance.service';
import { Repository } from 'typeorm';
import { CreateSavingsInput } from './dto/create-saving.input';
import { UpdateSavingsInput } from './dto/update-saving.input';
import { Savings } from './entities/saving.entity';

@Injectable()
export class SavingsService {
  constructor(@InjectRepository(Savings) private savingsRepository: Repository<Savings>, private savingsBalanceService: SavingsBalanceService) {}

   createSavings(profileId: number, createSavingsInput: CreateSavingsInput): Promise<Savings> {
    try {
      const newSavings = this.savingsRepository.create({profileId: profileId, ...createSavingsInput});
      return this.savingsRepository.save(newSavings)
    } catch (err) {
      throw err
    }
  }

  findSavings(): Promise<Savings[]> {
    try {
      return this.savingsRepository.find({take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  findAll(profileId: number, loadMoreInput: LoadMoreInput): Promise<[Savings[],number]>{
    try {
      return this.savingsRepository.findAndCount({where: {profileId}, take: loadMoreInput.limit, skip: loadMoreInput.offset, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
   }

  async findOne(profileId: number, id: number): Promise<Savings> { //ADD WITH ID (from class)
    try {
      const savings = await this.savingsRepository.findOne({ profileId, id })
      return savings
    } catch (err) {
      throw err
    } 
  }

  async updateSavings(updateSavingsInput: UpdateSavingsInput): Promise<Savings> { //FIX! NEEDS NAME TO UPDATE, BUT CAN'T IF CHANGING NAME
    try {
      const {id, ...savingsInput} = updateSavingsInput;
      const updatedSavings = await this.savingsRepository.preload({id: updateSavingsInput.id, ...savingsInput});
      return this.savingsRepository.save(updatedSavings);
    } catch (err) {
        throw err
      }
    }

    async removeSavings(profileId: number, id: number): Promise<Id> {
      try {
        const removedSavings = await this.findOne(profileId, id);
        await this.savingsRepository.remove(removedSavings);
        return {
          id: id,
        }
      } catch (err) {
        throw err
      }
    }

  //add savings to savingsgoals on first of the month
  @Cron('10 0 0 1 * *')
  async triggerCronJob(): Promise<void>{
     try {
      const allSavingsBalances = await this.savingsBalanceService.findAll();
      allSavingsBalances.map(async(balance: SavingsBalance) => {
        const startBalance  = balance.unassigned;
        let remainingBalance = balance.unassigned;
        const allSavingsForUser = await this.savingsRepository.find({where: {profileId: balance.profileId, complete: false}})
        allSavingsForUser.map(async (saving: Savings) => {
          let amount = 0;
          //check how much the difference is between the saving goal and the amount already saved
          const difference = saving.goal - saving.saved;
          if (saving.type === "amount") {
            //ensure the amount being saved is not more than the unassigned remaining balance
            amount = saving.amount <= remainingBalance ? saving.amount : 0;
            //ensure the difference between goal and amount saved so far is not bigger than the new amount saved
            amount = difference >= amount ? amount : difference;
          } else if (saving.type === "percentage") {
            const percentedAmount = Math.round((startBalance * saving.amount)/100);
            amount = percentedAmount <= remainingBalance ? percentedAmount : 0;
            amount = difference >= amount ? amount : difference;
          };
          remainingBalance -= amount;
          const newAmount = saving.saved + amount;
          const completed = saving.goal === newAmount
          const adjustedSavings = await this.savingsRepository.preload({id: saving.id, saved: newAmount, complete: completed});
          this.savingsRepository.save(adjustedSavings);
        });
        await this.savingsBalanceService.updateUnassignedBalance(balance.profileId, remainingBalance)
      });
    } catch (err) {
      throw err
    }
  }

  async assignSavings(profileId: number, assignInput: AssignInput): Promise<SavingsBalance> {
    try {
      //find savingsBalance from profile in question
      const savingsBalance = await this.savingsBalanceService.findOne(profileId);
      //find savings from profile in question 
      const savingsGoal = await this.findOne(profileId, assignInput.savingsId);
      let adjustedAmount = 0;

      if (assignInput.incoming) {
        adjustedAmount = assignInput.amount <= savingsBalance.unassigned ? assignInput.amount : savingsBalance.unassigned;
      } else if (!assignInput.incoming) {
        adjustedAmount = assignInput.amount <= savingsGoal.saved ? -assignInput.amount : 0;
      }
      const newUnassigned = savingsBalance.unassigned - adjustedAmount;
      const newSaved = savingsGoal.saved + adjustedAmount;
      const finalSavingsBalance = await this.savingsBalanceService.updateUnassignedBalance(savingsBalance.id, newUnassigned);
      await this.savingsRepository.update({id: assignInput.savingsId}, {saved: newSaved});
      return finalSavingsBalance;
    } catch (err) {
        throw err
      }
   }
}

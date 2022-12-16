import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SavingsBalanceService } from 'src/savings-balance/savings-balance.service';
import { Repository } from 'typeorm';
import { BalanceInput } from './dto/balance.input';
import { Balance } from './entities/balance.entity';
import { Cron } from '@nestjs/schedule'
import { Id } from 'src/models/update.model';
import { AdjustSavingsInput } from './dto/adjustsavings.input';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';

@Injectable()
export class BalanceService {
      constructor(@InjectRepository(Balance) private balanceRepository: Repository<Balance>, private savingsBalanceService: SavingsBalanceService) {}

      async findOne(profileId: number): Promise<Balance>  {
        try {
          const balance = await this.balanceRepository.findOne({ profileId })
          return balance
        } catch (err) {
          throw err
        } 
      }

    createBalance(id: number): Promise<Balance> {
      try {const newBalance = this.balanceRepository.create({profileId: id, current: 0});
      return this.balanceRepository.save(newBalance);
      } catch (err) {
        throw err
      }
    }


    async updateBalance(profileId: number, amount: number): Promise<Balance> {
      try {
        const balanceToUpdate = await this.findOne(profileId);
        const adjustedAmount = balanceToUpdate.current + amount;
        const updatedBalance = await this.balanceRepository.preload({id: balanceToUpdate.id, current: adjustedAmount})
        return this.balanceRepository.save(updatedBalance)
      } catch (err) {
          throw err
        }
    }

  async findAllBalances(): Promise<SavingsBalance[]> {
    try {
      return this.savingsBalanceService.findAll()
    } catch (err) {
      throw err
    }
  }

  async updateSavingsBalanceCron(profileId: number, newSavings: number): Promise<void>{
    try {
      await this.savingsBalanceService.updateSavingsBalance(profileId, newSavings);
    } catch (err) {
      throw err
    }
  }

  async insertBalance(profileId: number, current: number): Promise<void> {
    try {
      await this.balanceRepository.update({profileId}, {current})
    } catch (err) {
      throw err
    }
  }

  async updateSavingsAndBalance(profileId: number, savingsInput: AdjustSavingsInput): Promise<SavingsBalance> {
    try {
    const balanceToUpdate = await this.findOne(profileId);
    const savingsBalanceToUpdate = await this.savingsBalanceService.findOne(profileId);
    let amountToUpdate = 0;
    if (savingsInput.incoming) {
      amountToUpdate = savingsInput.amount < balanceToUpdate.current ? savingsInput.amount : balanceToUpdate.current
    } else if (!savingsInput.incoming) {
      amountToUpdate = savingsInput.amount < savingsBalanceToUpdate.total ? -savingsInput.amount : 0
    }
    const newCurrentBalance = balanceToUpdate.current - amountToUpdate;
    const newTotalBalance = savingsBalanceToUpdate.total + amountToUpdate;
    const newUnassigned = savingsBalanceToUpdate.unassigned + amountToUpdate
    const updatedSavingsBalance = await this.savingsBalanceService.insertSavingsBalance(profileId, newTotalBalance, newUnassigned)
    const updatedBalance = await this.balanceRepository.preload({id: balanceToUpdate.id, current: newCurrentBalance, ...savingsInput});
    this.balanceRepository.save(updatedBalance);
    return updatedSavingsBalance
    } catch (err) {
      throw err
    }
  }

}
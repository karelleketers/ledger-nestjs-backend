import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Id } from 'src/models/update.model';
import { Repository } from 'typeorm';
import { MonthlyInput } from './dto/monthly.input';
import { SavingsBalance } from './entities/savingsbalance.entity';

@Injectable()
export class SavingsBalanceService {
  constructor(@InjectRepository(SavingsBalance) private savingsBalanceRepository: Repository<SavingsBalance>) {}

  findAll(): Promise<SavingsBalance[]> {
    try {
      return this.savingsBalanceRepository.find();
    } catch (err) {
      throw err
    }
  }

  async findOne(profileId: number): Promise<SavingsBalance>  {
    try {
      const balance = await this.savingsBalanceRepository.findOne({ profileId })
      return balance
    } catch (err) {
      throw err
    } 
  }

  createSavingsBalance(id: number): Promise<SavingsBalance> {
  try {
    const newBalance = this.savingsBalanceRepository.create({profileId: id, total: 0, monthly_savings: "0"});
    return this.savingsBalanceRepository.save(newBalance);
  } catch (err) {
    throw err
  }
}


async updateSavingsBalance(profileId: number, amount: number): Promise<SavingsBalance> {
  try {
    const savingsBalanceToUpdate = await this.findOne(profileId);
    const adjustedAmount = savingsBalanceToUpdate.total + amount;
    const adjustedUnassigned = savingsBalanceToUpdate.unassigned + amount
    const updatedBalance = await this.savingsBalanceRepository.preload({id: savingsBalanceToUpdate.id, total: adjustedAmount, unassigned: adjustedUnassigned})
    return this.savingsBalanceRepository.save(updatedBalance)
  } catch (err) {
      throw err
    }
} 

async updateMonthlySavings(monthlyInput: MonthlyInput): Promise<SavingsBalance> {
  try {
    const adjustedMonthlySavings = monthlyInput.monthly_savings === "all" ? "all" : (parseFloat(monthlyInput.monthly_savings)*100).toString()
    const updatedSavingsBalance = await this.savingsBalanceRepository.preload({id: monthlyInput.id, monthly_savings: adjustedMonthlySavings});
    return this.savingsBalanceRepository.save(updatedSavingsBalance);
  } catch (err) {
      throw err
    }
} 

async updateUnassignedBalance(id: number, unassigned: number): Promise<SavingsBalance>{
  try {
    const updatedSavingsBalance = await this.savingsBalanceRepository.preload({id, unassigned});
    return this.savingsBalanceRepository.save(updatedSavingsBalance);
  } catch (err) {
      throw err
    }
}

async insertSavingsBalance(profileId: number, total: number, unassigned: number): Promise<SavingsBalance> {
  try {
    await this.savingsBalanceRepository.update({profileId}, {unassigned, total})
    return this.findOne(profileId)
  } catch (err) {
      throw err
    }
 }
}

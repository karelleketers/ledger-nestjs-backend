import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { AdjustSavingsInput } from 'src/balance/dto/adjustsavings.input';
import { CategoriesService } from 'src/categories/categories.service';
import { LoadMoreInput } from 'src/models/load-more.input';
import { Id } from 'src/models/update.model';
import { SavingsBalance } from 'src/savings-balance/entities/savingsbalance.entity';
import { Repository } from 'typeorm';
import { CreateEntryInput } from './dto/create-entry.input.ts';
import { UpdateEntryInput } from './dto/update-entry.input.ts';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntriesService {
  constructor(@InjectRepository(Entry) private entriesRepository: Repository<Entry>, private balanceService: BalanceService, private categoriesService: CategoriesService) {}

  async createEntry(profileId: number, entryInput: CreateEntryInput): Promise<Entry> {
    try {
      const {categoryId, ...createEntryInput} = entryInput
      const newEntry = this.entriesRepository.create({profileId, ...createEntryInput});
      const savedEntry = this.entriesRepository.save(newEntry);
      const { amount, incoming, type } = createEntryInput;
      const addToBalance = incoming ? amount : -(amount);
      this.balanceService.updateBalance(profileId, addToBalance);
      if (!incoming && type === "category") {
        await this.categoriesService.updateCategoryBalance(profileId, categoryId, amount)
      }
      return savedEntry;
    } catch (err) {
      throw err
    }
  }

  findEntries(): Promise<Entry[]> {
    try {
      return this.entriesRepository.find({take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  findDashboardEntries(profileId: number): Promise<Entry[]> {
    try {
      return this.entriesRepository.find({where: {profileId: profileId}, take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  findAll(profileId: number, loadMoreInput: LoadMoreInput): Promise<[Entry[],number]>{
   try {
    return this.entriesRepository.findAndCount({where: {profileId: profileId}, take: loadMoreInput.limit, skip: loadMoreInput.offset, order: {updatedAt: "DESC"}});
  } catch (err) {
    throw err
  }
  }

  async findOne(profileId: number, id: number): Promise<Entry> { //ADD WITH ID (from class)
    try {
      const entry = await this.entriesRepository.findOne({profileId, id})
      return entry
    } catch (err) {
      throw err
    } 
  }

  async updateEntry(profileId: number, updateEntryInput: UpdateEntryInput): Promise<Entry> {
    try { 
      const entryToUpdate = await this.findOne(profileId, updateEntryInput.id);
      const adjustedAmount = entryToUpdate.incoming ? -(entryToUpdate.amount - updateEntryInput.amount) : entryToUpdate.amount - updateEntryInput.amount
      await this.balanceService.updateBalance(profileId, adjustedAmount);
      const updatedEntry = await this.entriesRepository.preload({...updateEntryInput});
        if (entryToUpdate.type === "category") {
          await this.categoriesService.adjustCategory(profileId, entryToUpdate.category, adjustedAmount)
        } 
        if (entryToUpdate.type === "savings") {
          await this.balanceService.updateSavingsBalanceCron(profileId, -adjustedAmount);
      }
      return this.entriesRepository.save(updatedEntry);
    } catch (err) {
        throw err
      }
    }

    async removeEntry(profileId: number, id: number): Promise<Id> {
      try {
        const removedEntry = await this.findOne(profileId, id);
        const adjustedAmount = removedEntry.incoming ? -removedEntry.amount : removedEntry.amount
        await this.balanceService.updateBalance(profileId, adjustedAmount);
        if (removedEntry.type === "category") {
          await this.categoriesService.adjustCategory(profileId, removedEntry.category, adjustedAmount)
        } 
        if (removedEntry.type === "savings") {
          await this.balanceService.updateSavingsBalanceCron(profileId, -adjustedAmount);
        }
        /* await this.entriesRepository.delete(id); */
        await this.entriesRepository.remove(removedEntry);
        return {
          id: id,
        }
      } catch (err) {
        throw err
      }
    }

  async updateSavingsEntry(profileId: number, savingsInput: AdjustSavingsInput): Promise<SavingsBalance> {
    try {
      const newEntry = this.entriesRepository.create({profileId, type: "savings", category: "savings", incoming: !savingsInput.incoming, amount: savingsInput.amount});
      await this.entriesRepository.save(newEntry);
      const updatedSavingsBalance = await this.balanceService.updateSavingsAndBalance(profileId, savingsInput);
      return updatedSavingsBalance;
    } catch (err) {
      throw err
    }
  }

  @Cron('10 0 0 1 * *')
  async triggerCronJob(): Promise<void>{
     try {
      const monthlySavings = await this.balanceService.findAllBalances();
      monthlySavings.map(async(savings) => {
        //find matching balance of savingsbalance 
        const balance = await this.balanceService.findOne(savings.profileId);
        const newSavings = savings.monthly_savings === "all" ? balance.current : parseFloat(savings.monthly_savings) * 100;
        await this.balanceService.updateSavingsBalanceCron(savings.profileId, (newSavings <= balance.current ? newSavings : 0));
        await this.balanceService.updateBalance(savings.profileId, (newSavings <= balance.current ? -newSavings : 0));
        const newEntry = await this.entriesRepository.create({profileId: savings.profileId, type: "savings", category: "savings", incoming: false, amount: newSavings})
        balance.current > 0 && newEntry.amount > 0 && newEntry.amount < balance.current && this.entriesRepository.save(newEntry);
      });
    } catch (err) {
      throw err
    }
  }
}

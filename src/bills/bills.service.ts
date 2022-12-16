import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillInput } from './dto/create-bill.input';
import { UpdateBillInput } from './dto/update-bill.input';
import { Bill } from './entities/bill.entity';
import { Cron } from '@nestjs/schedule'
import { EntriesService } from 'src/entries/entries.service';
import { ProfileService } from 'src/profile/profile.service';
import { Id } from 'src/models/update.model';
import { LoadMoreInput } from 'src/models/load-more.input';

@Injectable()
export class BillsService {
  constructor(@InjectRepository(Bill) private billsRepository: Repository<Bill>, private entriesService: EntriesService,  @Inject(forwardRef(() => ProfileService)) private profileService: ProfileService) {}

  async createBill(userId: number, billInput: CreateBillInput): Promise<Bill> {
    try {
      const profile = await this.profileService.findOne(userId);
      const reminder = profile.reminder;
      const newBill = this.billsRepository.create({profileId: profile.id, reminder: reminder, ...billInput});
      return this.billsRepository.save(newBill)
    } catch (err) {
      throw err
    }
  }

  @Cron('0 0 0 1 * *')//adjust back to 1st 
  async triggerCronJob(): Promise<void>{
     try {
      const allBillsWithReminders = await this.billsRepository.find({reminder: true});
      allBillsWithReminders.map(async(bill) => {
        const updatedBill = await this.billsRepository.preload({id: bill.id, paid: false});
        this.billsRepository.save(updatedBill)
      });
    } catch (err) {
      throw err
    }
  }

  findBills(): Promise<Bill[]> {
    try {
      return this.billsRepository.find({take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  findAll(profileId: number): Promise<Bill[]> {
    try {
      return this.billsRepository.find({where:{profileId}, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  async findBillsAndCount(profileId: number, userId: number, loadMoreInput: LoadMoreInput): Promise<[Bill[], number, number]>{
    try {
      const profile = await this.profileService.findOne(userId);
      const unpaidCount = profile.reminder ? await this.billsRepository.count({where: {profileId, paid: false}}) : 0;
      const [items, count] = await this.billsRepository.findAndCount({where: {profileId}, take: loadMoreInput.limit, skip: loadMoreInput.offset, order: {updatedAt: "DESC"}});
      return [items, count, unpaidCount]
    } catch (err) {
      throw err
    }
   }

  getUnpaidBills(profileId: number): Promise<Bill[]> {
    try {
      return this.billsRepository.find({profileId, paid: false});
    } catch (err) {
      throw err
    }
  }

  async updateMonthlyReminder (profileId: number, reminder: boolean): Promise<Bill[]> {
    try {
     const billsToUpdate = await this.findAll(profileId);
     billsToUpdate.map(async(bill) => {
      const updatedBill = await this.billsRepository.preload({id: bill.id, reminder});
      this.billsRepository.save(updatedBill)
     });
     return billsToUpdate;
    } catch (err) {
        throw err
      }
    }

  async findOne(profileId: number, id: number): Promise<Bill> { //ADD WITH ID (from class)
    try {
      const bill = await this.billsRepository.findOne({ profileId, id })
      return bill
    } catch (err) {
      throw err
    } 
  }

  async updateBill(profileId: number, billInput: UpdateBillInput): Promise<Bill> { //FIX! NEEDS BillNAME TO UPDATE, BUT CAN'T IF CHANGING NAME
    try {
      const newSettled = billInput.paid;
      const billToUpdate = await this.findOne(profileId, billInput.id);
      const prevSettled = billToUpdate.paid;
      if (newSettled === true && prevSettled === false) {
        const entryInput = {incoming: false, amount: billInput.amount, category: "bills", type: "bills", description: billInput.name}
        this.entriesService.createEntry(profileId, entryInput)
      }
      const updatedBill = await this.billsRepository.preload({id: billToUpdate.id, ...billInput});
      return this.billsRepository.save(updatedBill);
    } catch (err) {
        throw err
      }
    }

    async removeBill(profileId: number, id: number): Promise<Id> {
      try {
        const removedBill = await this.findOne(profileId, id);
        await this.billsRepository.remove(removedBill);
        return {
          id: id,
        }
      } catch (err) {
        throw err
      }
    }
}

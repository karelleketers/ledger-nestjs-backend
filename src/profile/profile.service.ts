import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillsService } from 'src/bills/bills.service';
import { Repository } from 'typeorm';
import { CreateOwnProfileInput } from './dto/create-own-profile.input';
import { OnBoarding } from './models/onboarding';
import { UpdateOwnProfileInput } from './dto/update-own-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private profilesRepository: Repository<Profile>, @Inject(forwardRef(() => BillsService)) private billsService: BillsService) {}

  findAll(): Promise<Profile[]> {
    try {
      return this.profilesRepository.find();
    } catch (err) {
      throw err
    }
  }

  async findOne(userId: number): Promise<Profile>  {
    try {
      const profile = await this.profilesRepository.findOne({ userId })
      return profile
    } catch (err) {
      throw err
    } 
  }

  createProfile(id: number, input: CreateOwnProfileInput): Promise<Profile> {
    try {
      const newProfile = this.profilesRepository.create({userId: id, ...input});
      return this.profilesRepository.save(newProfile);
    } catch (err) {
      throw err
    }
  }

  async updateProfile(userId: number, updateProfileInput: UpdateProfileInput | UpdateOwnProfileInput): Promise<Profile> {
    try {
    const newReminder = updateProfileInput.reminder;
    const profileToUpdate = await this.findOne(userId);
    const prevReminder = profileToUpdate.reminder;
    if (newReminder !== prevReminder) {
      this.billsService.updateMonthlyReminder(profileToUpdate.id, newReminder);
    }
    const updatedProfile = await this.profilesRepository.preload({id: profileToUpdate.id, ...updateProfileInput})
    return this.profilesRepository.save(updatedProfile)
  } catch (err) {
      throw err
    }
  }

  async finishedOnBoarding(id: number): Promise<OnBoarding> {
    try {
    const updatedProfile = await this.profilesRepository.preload({id, onboarding: "finished"})
    return this.profilesRepository.save(updatedProfile)
  } catch (err) {
      throw err
    }
  }

  async skipQuestionnaire(id: number): Promise<OnBoarding> {
    try {
      const updatedProfile = await this.profilesRepository.preload({id, onboarding: "ongoing"})
      const savedProfile = await this.profilesRepository.save(updatedProfile);
      return {onboarding: savedProfile.onboarding};
    } catch (err) {
        throw err
      }
  }

  async updateUserDetails(id: number, bank: string): Promise<Profile> {
    try {
      const updatedProfile = await this.profilesRepository.preload({id, bank});
      return this.profilesRepository.save(updatedProfile);
    } catch (err) {
      throw err
    }
  }
}

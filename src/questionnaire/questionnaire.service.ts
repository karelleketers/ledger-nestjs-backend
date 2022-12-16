import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceService } from 'src/balance/balance.service';
import { Id } from 'src/models/update.model';
import { ProfileService } from 'src/profile/profile.service';
import { SavingsBalanceService } from 'src/savings-balance/savings-balance.service';
import { Repository } from 'typeorm';
import { UpdateQuestionnaireInput } from './dto/update-questionnaire.input';
import { Questionnaire } from './entities/questionnaire.entity';

@Injectable()
export class QuestionnaireService {
    constructor(@InjectRepository(Questionnaire) private questionnaireRepository: Repository<Questionnaire>, private profileService: ProfileService, private readonly balanceService: BalanceService, private readonly savingsBalanceService: SavingsBalanceService,) {}

    findAll(): Promise<Questionnaire[]> {
      try {
        return this.questionnaireRepository.find();
      } catch (err) {
        throw err
      }
    }

    async findOne(profileId: number): Promise<Questionnaire>  {
      try {
        const questionnaire = await this.questionnaireRepository.findOne({ profileId })
        return questionnaire
      } catch (err) {
        throw err
      } 
    }

  createQuestionnaire(profileId: number): Promise<Questionnaire> {
    try {
      const newQuestionnaire = this.questionnaireRepository.create({profileId});
      return this.questionnaireRepository.save(newQuestionnaire);
    } catch (err) {
      throw err
    }
  }

  async updateQuestionnaire(userId: number, profileId: number, updateQuestionnaireInput: UpdateQuestionnaireInput): Promise<Questionnaire> {
    try {
      const {balance, savings, ...questionnaireInput} = updateQuestionnaireInput;
      const questionnaire = await this.findOne(profileId);
      const updatedQuestionnaire = await this.questionnaireRepository.preload({id: questionnaire.id, ...questionnaireInput});
      //adjust state for refreshtoken
      await this.profileService.finishedOnBoarding(userId);
      //add balance amount if any
      updateQuestionnaireInput.balance && await this.balanceService.insertBalance(profileId, balance);
      //add savings amount if any
      updateQuestionnaireInput.savings && await this.savingsBalanceService.insertSavingsBalance(profileId, savings, savings);
      return this.questionnaireRepository.save(updatedQuestionnaire);
    } catch (err) {
        throw err
      }
    }
}

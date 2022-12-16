import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadMoreInput } from 'src/models/load-more.input';
import { Id } from 'src/models/update.model';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';

@Injectable() 
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoriesRepository: Repository<Category>) {}

  createCategory(profileId: number, createCategoryInput: CreateCategoryInput): Promise<Category> {
    try {
      const newCategory = this.categoriesRepository.create({profileId: profileId, ...createCategoryInput});
      return this.categoriesRepository.save(newCategory)
    } catch (err) {
      throw err
    }
  }

  findCategories(): Promise<Category[]> {
    try {
      return this.categoriesRepository.find({take: 3, order: {updatedAt: "DESC"}});
    } catch (err) {
      throw err
    }
  }

  findCategoriesList(profileId: number): Promise<Category[]> {
    try {
      return this.categoriesRepository.find({where:{profileId: profileId}, order: {createdAt: "ASC"}});
    } catch (err) {
      throw err
    }
  }

  findAll(profileId: number, loadMoreInput: LoadMoreInput): Promise<[Category[], number]> {
    try {
      return this.categoriesRepository.findAndCount({where:{profileId: profileId}, take: loadMoreInput.limit, skip: loadMoreInput.offset, order: {createdAt: "ASC"}});
    } catch (err) {
      throw err
    }
  }

  async findOne(profileId: number, id: number): Promise<Category> { //ADD WITH ID (from class)
    try {
      const category = await this.categoriesRepository.findOne({ profileId, id })
      return category
    } catch (err) {
      throw err
    } 
  }

  //reset categories on first of the month
  @Cron('0 0 0 1 * *')
  async triggerCronJob(): Promise<void>{
    try {const allCategories = await this.categoriesRepository.find();
    allCategories.map(async(cat) => {
      const updatedCategory = await this.categoriesRepository.preload({id: cat.id, current: cat.total});
      this.categoriesRepository.save(updatedCategory)
     });
    } catch(err) {
      throw err
    }
  }

  async updateCategory(profileId: number, updateCategoryInput: UpdateCategoryInput): Promise<Category> { //FIX! NEEDS CATEGORYNAME TO UPDATE, BUT CAN'T IF CHANGING NAME
    try {
      await this.categoriesRepository.update({id: updateCategoryInput.id}, {...updateCategoryInput})
      const updatedCategory = await this.findOne(profileId, updateCategoryInput.id);
      return updatedCategory;
    } catch (err) {
        throw err
      }
    }

    async updateCategoryBalance(profileId: number, id: number, amount: number): Promise<Category> {
      try {
        const categoryToUpdate = await this.findOne(profileId, id);
        const newBalance = categoryToUpdate.current - amount;
        const updatedCategory = await this.categoriesRepository.preload({id: categoryToUpdate.id, current: newBalance})
        return this.categoriesRepository.save(updatedCategory)
      } catch (err) {
        throw err
      }
    }


    async removeCategory(profileId: number, id: number): Promise<Id> {
      try {
        const removedCategory = await this.findOne(profileId, id);
        await this.categoriesRepository.remove(removedCategory);
        return {
          id: id,
        }
      } catch (err) {
        throw err
      }
    }

    async adjustCategory(profileId: number, name: string, amount: number): Promise<void> {
      try {
        const categoryToUpdate = await this.categoriesRepository.findOne({profileId, name});
        if (categoryToUpdate) {const adjustedCatBalance = categoryToUpdate.current + amount;
        await this.categoriesRepository.update({profileId, name}, {current: adjustedCatBalance})}
      } catch (err) {
        throw err
      }
  }
}
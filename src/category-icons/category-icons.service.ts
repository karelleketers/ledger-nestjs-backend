import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryIcon } from './entities/category-icon.entity';

@Injectable()
export class CategoryIconsService {
  constructor(@InjectRepository(CategoryIcon) private categoryIconsRepository: Repository<CategoryIcon>) {}

  createCategoryIcon(name: string) {
    try {
      const newCategoryIcon = this.categoryIconsRepository.create({ name });
      return this.categoryIconsRepository.save(newCategoryIcon);
    } catch (err) {
      throw err
    }
  }

  findAll(): Promise<CategoryIcon[]> {
    try {
      return this.categoryIconsRepository.find();
    } catch (err) {
      throw err
    }
  }

  async findOne(name: string): Promise<CategoryIcon>  {
    try {
      const categoryIcon = await this.categoryIconsRepository.findOne({ name })
      return categoryIcon
    } catch (err) {
      throw err
    } 
  }

  async updateCategoryIcon(name: string): Promise<CategoryIcon> {
    try {
      const categoryIconToUpdate = await this.findOne(name);
      const updatedCategoryIcon = await this.categoryIconsRepository.preload({id: categoryIconToUpdate.id, name})
      return this.categoryIconsRepository.save(updatedCategoryIcon)
    } catch (err) {
        throw err
      }
    }

  async removeCategoryIcon(name: string) {
    try {
      const removedCategoryIcon = await this.findOne(name);
      await this.categoryIconsRepository.remove(removedCategoryIcon);
      return {
        name: name,
      }
    } catch (err) {
  }
  }
}

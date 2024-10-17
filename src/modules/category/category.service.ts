import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { CreateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  fetchCategories(){
    console.log('fetching categories');
    return this.categoryRepository.findAll();
  }

  async createCategory(categorydto: CreateCategoryDto) {
    const categoryModel = this.categoryRepository.create(categorydto);
    await this.em.persistAndFlush(categoryModel);
    return categoryModel;
  }
}

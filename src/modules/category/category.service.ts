import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { CreateCategoryDto } from './category.dto';
import { v4 } from 'uuid';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  fetchCategories(){
    return this.categoryRepository.findAll();
  }

  async createCategory(categorydto: CreateCategoryDto) {
    const categoryModel = this.categoryRepository.create({
      uuid: v4(),
      name: categorydto.name
    });
    await this.em.persistAndFlush(categoryModel);
    return categoryModel;
  }
}

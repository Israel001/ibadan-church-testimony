import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  async fetchCategories() {
    return this.categoryRepository.find({});
  }
}

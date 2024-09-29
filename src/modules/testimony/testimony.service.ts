import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateTestimonyDto } from './testimony.dto';
import { Testimony } from './testimony.entity';
import { v4 } from 'uuid';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';

@Injectable()
export class TestimonyService {
  constructor(
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    @InjectRepository(Users)
    private readonly usersRepository: EntityRepository<Users>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly em: EntityManager,
  ) {}

  async createTestimony(testimony: CreateTestimonyDto, session: any) {
    const testimonyModel = this.testimonyRepository.create({
      uuid: v4(),
      firstname: testimony.firstname,
      lastname: testimony.lastname,
      email: testimony.email,
      address: testimony.address,
      country: testimony.country,
      category: this.categoryRepository.getReference(testimony.categoryUuid),
      anonymous: testimony.anonymous,
      isFeatured: false,
      published: false,
      image: testimony.image,
      testimony: testimony.testimony,
      ...(session.userId
        ? { user: this.usersRepository.getReference(session.userId) }
        : {}),
    });
    await this.em.persistAndFlush(testimonyModel);
    return testimonyModel;
  }

  async fetchTestimonies(pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
    const [testimonies, total] = await this.testimonyRepository.findAndCount(
      {
        published: true,
      },
      {
        orderBy: {
          isFeatured: 'DESC',
          createdAt: 'DESC',
        },
        limit,
        offset: (page - 1) * limit,
      },
    );
    return buildResponseDataWithPagination(testimonies, total, { page, limit });
  }

  async fetchTestimony(uuid: string) {
    return this.testimonyRepository.findOne({ uuid });
  }
}

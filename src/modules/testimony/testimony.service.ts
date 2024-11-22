import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateTestimonyDto } from './testimony.dto';
import { Testimony } from './testimony.entity';
import { v4 } from 'uuid';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';
import { CommentService } from '../comment/comment.service';
import { TestimonyStatus } from 'src/types';

@Injectable()
export class TestimonyService {
  constructor(
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    @InjectRepository(Users)
    private readonly usersRepository: EntityRepository<Users>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly commentService: CommentService,
    private readonly em: EntityManager,
  ) {}

  async createTestimony(
    testimonyDto: CreateTestimonyDto,
    session: any,
  ): Promise<Testimony> {
    const testimonyModel = this.testimonyRepository.create({
      uuid: v4(),
      firstname: testimonyDto.firstname.trim(),
      lastname: testimonyDto.lastname.trim(),
      email: testimonyDto.email,
      address: testimonyDto.address,
      country: testimonyDto.country,
      phoneNumber: testimonyDto.phoneNumber,
      category: testimonyDto.categoryUuid
        ? this.categoryRepository.getReference(testimonyDto.categoryUuid)
        : null,
      anonymous: testimonyDto.anonymous,
      isFeatured: false,
      status: TestimonyStatus.PENDING,
      image: testimonyDto.image,
      testimony: testimonyDto.testimony,
      ...(session.userId
        ? { user: this.usersRepository.getReference(session.userId) }
        : {}),
    });

    await this.em.persistAndFlush(testimonyModel);
    return testimonyModel;
  }

  async updateTestimony(
    uuid: string,
    updates: Partial<CreateTestimonyDto>,
  ): Promise<Testimony> {
    try {
      const testimony = await this.testimonyRepository.findOne({ uuid });

      if (!testimony) {
        throw new Error('Testimony not found');
      }

      if (updates.firstname) testimony.firstname = updates.firstname;
      if (updates.lastname) testimony.lastname = updates.lastname;
      if (updates.email) testimony.email = updates.email;
      if (updates.address) testimony.address = updates.address;
      if (updates.country) testimony.country = updates.country;
      if (updates.phoneNumber) testimony.phoneNumber = updates.phoneNumber;
      if (updates.categoryUuid) {
        testimony.category = this.categoryRepository.getReference(
          updates.categoryUuid,
        );
      }
      if (updates.anonymous !== undefined)
        testimony.anonymous = updates.anonymous;
      if (updates.testimony) testimony.testimony = updates.testimony;
      if (updates.image) testimony.image = updates.image; // Update the image if a new file is uploaded

      await this.em.persistAndFlush(testimony);

      return testimony;
    } catch (error) {
      console.error('Error updating testimony:', error);
      throw new Error('Failed to upload testimony');
    }
  }

  async fetchTestimonies(pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
    const [testimonies, total] = await this.testimonyRepository.findAndCount(
      { status: TestimonyStatus.APPROVED },
      {
        orderBy: {
          isFeatured: 'DESC',
          createdAt: 'DESC',
        },
        limit,
        offset: (page - 1) * limit,
        populate: ['user'],
      },
    );
    return buildResponseDataWithPagination(testimonies, total, { page, limit });
  }

  async fetchTestimonyWithSurrounding(uuid: string): Promise<any> {
    const testimony = await this.testimonyRepository.findOne({ uuid });
    if (!testimony) {
      throw new NotFoundException('Testimony not found');
    }

    const comments = await this.commentService.fetchCommentsByTestimony(uuid);
    const moreTestimonies = await this.getRandomTestimonies();
    const byCategory = await this.getTestimoniesGroupedByCategory();

    const previousTestimony = await this.testimonyRepository.findOne(
      {
        createdAt: { $lt: testimony.createdAt },
        status: TestimonyStatus.APPROVED,
      },
      { orderBy: { createdAt: 'DESC' } },
    );

    const nextTestimony = await this.testimonyRepository.findOne(
      {
        createdAt: { $gt: testimony.createdAt },
        status: TestimonyStatus.APPROVED,
      },
      { orderBy: { createdAt: 'ASC' } },
    );

    return {
      testimony,
      previousTestimony,
      nextTestimony,
      comments,
      moreTestimonies,
      byCategory,
    };
  }

  async fetchTestimony(uuid: string): Promise<Testimony> {
    const testimony = await this.testimonyRepository.findOne({ uuid });
    if (!testimony) {
      throw new NotFoundException('Testimony not found');
    }
    return testimony;
  }

  async getRandomTestimonies(): Promise<Testimony[]> {
    const allTestimonies = await this.testimonyRepository.find({
      status: TestimonyStatus.APPROVED,
    });

    if (allTestimonies.length <= 5) {
      return allTestimonies;
    }

    const featuredTestimonies = allTestimonies.filter(
      (testimony) => testimony.isFeatured,
    );
    const nonFeaturedTestimonies = allTestimonies.filter(
      (testimony) => !testimony.isFeatured,
    );

    const result: Testimony[] = [];

    if (featuredTestimonies.length >= 5) {
      result.push(...this.getRandomItems(featuredTestimonies, 5));
    } else {
      result.push(...featuredTestimonies);

      const remainingSlots = 5 - result.length;
      result.push(
        ...this.getRandomItems(nonFeaturedTestimonies, remainingSlots),
      );
    }

    return result;
  }

  private getRandomItems<T>(items: T[], count: number): T[] {
    const shuffled = items.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffled.slice(0, count); // Return the number of items requested
  }

  async getTestimoniesGroupedByCategory(): Promise<{
    [category: string]: Testimony[];
  }> {
    console.log('getTestimoniesGroupedByCategory');
    // Fetch all testimonies
    const testimonies: Testimony[] = await this.testimonyRepository.find({
      status: TestimonyStatus.APPROVED,
    });

    // Group testimonies by category
    const groupedTestimonies = testimonies.reduce(
      (grouped, testimony) => {
        const category = testimony.category.name;

        if (!grouped[category]) {
          grouped[category] = [];
        }

        grouped[category].push(testimony);
        return grouped;
      },
      {} as { [category: string]: Testimony[] },
    );

    return groupedTestimonies;
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateTestimonyDto } from '../testimony/testimony.dto';
import { Testimony } from '../testimony/testimony.entity';
import { v4 } from 'uuid';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';
import { CommentService } from '../comment/comment.service';
import { AdminUser } from './admin.entities';
import bcrypt from 'bcryptjs';
import { IAdminAuthContext } from 'src/types';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    @InjectRepository(Users)
    private readonly usersRepository: EntityRepository<Users>,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: EntityRepository<AdminUser>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly commentService: CommentService,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async createTestimony(
    testimonyDto: CreateTestimonyDto,
    session: any,
  ): Promise<Testimony> {
    const testimonyModel = this.testimonyRepository.create({
      uuid: v4(),
      firstname: testimonyDto.firstname,
      lastname: testimonyDto.lastname,
      email: testimonyDto.email,
      address: testimonyDto.address,
      country: testimonyDto.country,
      phoneNumber: testimonyDto.phoneNumber,
      category: testimonyDto.categoryUuid
        ? this.categoryRepository.getReference(testimonyDto.categoryUuid)
        : null,
      anonymous: testimonyDto.anonymous,
      isFeatured: false,
      published: false,
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
    const testimonies = await this.testimonyRepository.findAll();
    const total = testimonies.length;
    return buildResponseDataWithPagination(testimonies, total, { page, limit });
  }

  async fetchTestimony(
    uuid: string,
  ): Promise<{ testimony: Testimony; unpublishedTestimonies: Testimony[] }> {
    const unpublishedTestimonies = await this.fetchUnpublishedTestimonies();
    const testimony = await this.testimonyRepository.findOne({ uuid });
    if (!testimony) {
      throw new NotFoundException('Testimony not found');
    }
    return { testimony: testimony, unpublishedTestimonies };
  }

  async fetchUnpublishedTestimonies(): Promise<Testimony[]> {
    return await this.testimonyRepository.find({
      published: false,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return user;
    throw new UnauthorizedException('Invalid details');
  }

  async findUserByEmail(email: string) {
    return this.adminUserRepository.findOne({
      email,
    });
  }

  async login(user: AdminUser) {
    const payload: IAdminAuthContext = {
      name: user.fullName,
      email: user.email,
      role: user.role,
      adminUserUuid: user.uuid,
    };
    const userInfo = await this.findUserByEmail(user.email);
    delete userInfo.password;
    delete userInfo.createdAt;
    delete userInfo.updatedAt;
    return {
      accessToken: this.jwtService.sign(payload),
      user: userInfo,
    };
  }

  async getTestimoniesGroupedByCategory(): Promise<{
    [category: string]: Testimony[];
  }> {
    // Fetch all testimonies
    const testimonies: Testimony[] = await this.testimonyRepository.find({
      published: true,
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

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Testimony } from '../testimony/testimony.entity';
import { v4 } from 'uuid';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';
import { CommentService } from '../comment/comment.service';
import { AdminRoles, AdminUser } from './admin.entities';
import bcrypt from 'bcryptjs';
import { IAdminAuthContext, TestimonyStatus } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import {
  AdminLoginDTO,
  CreateAdminTestimonyDto,
  CreateModeratorDto,
  UpdateCommentDto,
  UpdateTestimonyDto,
} from './dto';
import { Comment } from '../comment/comment.entity';
import { CreateCategoryDto } from '../category/category.dto';
import { CreateCommentDto } from '../comment/comment.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    @InjectRepository(Users)
    private readonly usersRepository: EntityRepository<Users>,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: EntityRepository<AdminUser>,
    @InjectRepository(AdminRoles)
    private readonly adminRoleRepository: EntityRepository<AdminRoles>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    private readonly commentService: CommentService,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async fetchModerators() {
    return this.adminUserRepository.findAll();
  }

  async deleteModerator(uuid: string) {
    return this.adminUserRepository.nativeDelete({ uuid });
  }

  async createModerator(moderator: CreateModeratorDto) {
    const adminRole = await this.adminRoleRepository.findOne({ name: 'Admin' });
    if (!adminRole) throw new NotFoundException('Admin role does not exist');
    const adminExist = await this.adminUserRepository.findOne({
      email: moderator.email,
    });
    if (adminExist) throw new ConflictException('Duplicate email');
    const hashedPassword = await bcrypt.hash(moderator.password, 12);
    const moderatorModel = this.adminUserRepository.create({
      uuid: v4(),
      fullName: moderator.fullname,
      email: moderator.email,
      phone: moderator.phone,
      password: hashedPassword,
      role: { uuid: adminRole.uuid },
    });
    await this.em.persistAndFlush(moderatorModel);
  }

  async createTestimony(
    testimonyDto: CreateAdminTestimonyDto,
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
      status: TestimonyStatus.APPROVED,
      image: testimonyDto.image,
      testimony: testimonyDto.testimony,
    });

    await this.em.persistAndFlush(testimonyModel);
    return testimonyModel;
  }

  async createCategory(category: CreateCategoryDto) {
    const categoryModel = this.categoryRepository.create({
      uuid: v4(),
      name: category.name,
    });
    await this.em.persistAndFlush(categoryModel);
    return categoryModel;
  }

  async createComment(uuid: string, comment: CreateCommentDto) {
    const testimony = await this.testimonyRepository.find({
      uuid,
    });
    if (!testimony) throw new NotFoundException('Testimony not found');
    const commentModel = this.commentRepository.create({
      uuid: v4(),
      name: comment.name,
      email: comment.email,
      comment: comment.comment,
      testimony,
    });
    await this.em.persistAndFlush(commentModel);
    return comment;
  }

  async fetchCategories() {
    return this.categoryRepository.findAll();
  }

  async fetchComments(uuid: string) {
    return this.commentRepository.find({ testimony: { uuid } });
  }

  async updateCategory(uuid: string, { name }: CreateCategoryDto) {
    return this.categoryRepository.nativeUpdate({ uuid }, { name });
  }

  async updateComment(uuid: string, comment: UpdateCommentDto) {
    return this.commentRepository.nativeUpdate({ uuid }, { ...comment });
  }

  async deleteCategory(uuid: string) {
    await this.testimonyRepository.nativeUpdate(
      { category: { uuid } },
      { category: null },
    );
    return this.categoryRepository.nativeDelete({ uuid });
  }

  async deleteComment(uuid: string) {
    return this.commentRepository.nativeDelete({ uuid });
  }

  async fetchToptestimonies() {
    const sql = `
    SELECT 
      firstname, 
      lastname, 
      COUNT(*) AS testimony_count
    FROM 
      testimonies
    GROUP BY 
      firstname, lastname
    ORDER BY 
      testimony_count DESC
    LIMIT 5
  `;

    const result = await this.em.getConnection().execute(sql);
    return result;
  }

  async updateTestimony(
    uuid: string,
    updates: UpdateTestimonyDto,
  ): Promise<Testimony> {
    try {
      const testimony = await this.testimonyRepository.findOne({ uuid });

      if (!testimony) {
        throw new NotFoundException('Testimony not found');
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
      if (updates.status) testimony.status = updates.status;
      if (updates.testimony) testimony.testimony = updates.testimony;
      if (updates.rejectionReason)
        testimony.rejectionReason = updates.rejectionReason;
      if (updates.image) testimony.image = updates.image; // Update the image if a new file is uploaded

      await this.em.persistAndFlush(testimony);

      switch (updates.status) {
        case TestimonyStatus.APPROVED:
        // SEND EMAIL FOR APPROVED TESTIMONY
        case TestimonyStatus.REJECTED:
        // SEND EMAIL FOR REJECTED TESTIMONY
      }

      return testimony;
    } catch (error) {
      console.error('Error updating testimony:', error);
      throw new Error('Failed to update testimony');
    }
  }

  async fetchDashboardData() {
    const [
      pendingTestimonies,
      activeTestimonies,
      rejectedTestimonies,
      allUsers,
      allComments,
      allAdmins,
    ] = await Promise.all([
      this.testimonyRepository.count({ status: TestimonyStatus.PENDING }),
      this.testimonyRepository.count({ status: TestimonyStatus.APPROVED }),
      this.testimonyRepository.count({ status: TestimonyStatus.REJECTED }),
      this.usersRepository.count(),
      this.commentRepository.count(),
      this.adminUserRepository.count(),
    ]);

    const allTestimonies =
      pendingTestimonies + activeTestimonies + rejectedTestimonies;

    return {
      pendingTestimonies,
      activeTestimonies,
      rejectedTestimonies,
      allUsers,
      allComments,
      allTestimonies,
      allAdmins,
    };
  }

  async fetchTestimonies(
    pagination: PaginationInput,
    status?: TestimonyStatus,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const [testimonies, total] = await this.testimonyRepository.findAndCount(
      {
        ...(status ? { status } : {}),
      },
      {
        limit,
        offset: limit * (page - 1),
      },
    );
    return buildResponseDataWithPagination(testimonies, total, { page, limit });
  }

  async fetchTestimony(
    uuid: string,
  ): Promise<{ testimony: Testimony; unpublishedTestimonies: Testimony[] }> {
    const unpublishedTestimonies = await this.fetchUnpublishedTestimonies(uuid);
    const testimony = await this.testimonyRepository.findOne({ uuid });
    if (!testimony) {
      throw new NotFoundException('Testimony not found');
    }
    return { testimony: testimony, unpublishedTestimonies };
  }

  async fetchUnpublishedTestimonies(uuid: string): Promise<Testimony[]> {
    return await this.testimonyRepository.find(
      {
        status: TestimonyStatus.PENDING,
        uuid: { $ne: uuid },
      },
      { limit: 5 },
    );
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

  async login(request: AdminLoginDTO, session: any) {
    const user = await this.validateUser(request.email, request.password);
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
    session.user = payload;
    return user;
  }

  async getTestimoniesGroupedByCategory(): Promise<{
    [category: string]: Testimony[];
  }> {
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

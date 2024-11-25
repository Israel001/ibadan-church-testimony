import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  Render,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import * as dtos from './dto';
import { AdminAuthGuard } from './guards/auth-guard';
import { TestimonyStatus } from 'src/types';
import { CreateCommentDto } from '../comment/comment.dto';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Render('dashboard')
  async dashboard() {
    const result = await this.adminService.fetchDashboardData();
    const topTestimonies = await this.adminService.fetchToptestimonies();
    return { dashboardData: result, topTestimonies };
  }

  @Post('auth/login')
  @AllowUnauthorizedRequest()
  async login(@Body() body: dtos.AdminLoginDTO, @Session() session: any) {
    return this.adminService.login(body, session);
  }

  @Get('forgot-password')
  @Render('forgot-password')
  @AllowUnauthorizedRequest()
  forgotPassword() {
    return {};
  }

  @Get('reset-password')
  @Render('reset-password')
  @AllowUnauthorizedRequest()
  resetPassword() {
    return {};
  }

  @Get('sign-in')
  @Render('sign-in')
  @AllowUnauthorizedRequest()
  signIn() {
    return {};
  }

  @Get('sign-out')
  @Render('sign-out')
  @AllowUnauthorizedRequest()
  signOut() {
    return {};
  }

  @Get('sign-up')
  @Render('sign-up')
  signUp() {
    return {};
  }

  @Get('upload-testimony')
  @Render('upload-testimony')
  uploadTestimony() {
    return {};
  }

  @Post('create-testimony')
  createTestimony(@Body() body: dtos.CreateAdminTestimonyDto) {
    return this.adminService.createTestimony(body);
  }

  @Post('category')
  createCategory(@Body() body: dtos.CreateCategoryDto) {
    return this.adminService.createCategory(body);
  }

  @Post('testimony/:uuid/comment')
  createComment(@Param('uuid') uuid: string, @Body() body: CreateCommentDto) {
    return this.adminService.createComment(uuid, body);
  }

  @Get('categories')
  @Render('categories')
  async fetchCategories() {
    try {
      const response = await this.adminService.fetchCategories();
      console.log('response', response);
      return { categories: response };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [] };
    }
  }

  @Get('testimony/:uuid/comments')
  fetchComments(@Param('uuid') uuid: string) {
    return this.adminService.fetchComments(uuid);
  }

  @Put('category/:uuid')
  updateCategory(
    @Param('uuid') uuid: string,
    @Body() body: dtos.CreateCategoryDto,
  ) {
    return this.adminService.updateCategory(uuid, body);
  }

  @Put('testimony/:uuid/comments/:commentUuid')
  updateComment(
    @Param('commentUuid') commentUuid: string,
    @Body() body: dtos.UpdateCommentDto,
  ) {
    return this.adminService.updateComment(commentUuid, body);
  }

  @Delete('category/:uuid')
  deleteCategory(@Param('uuid') uuid: string) {
    return this.adminService.deleteCategory(uuid);
  }

  @Delete('testimony/:uuid/comments/:commentUuid')
  deleteComment(@Param('commentUuid') commentUuid: string) {
    return this.adminService.deleteComment(commentUuid);
  }

  @Get('view-testimony/:uuid')
  @Render('view_testimony')
  async viewTestimony(@Param('uuid') uuid: string) {
    const result = await this.adminService.fetchTestimony(uuid);
    return result;
  }

  @Get('testimonies')
  @Render('testimonies')
  async fetchTestimonies(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: dtos.TestimonyQuery,
  ) {
    const intPage = (page && Number(page)) || 1;
    const intLimit = (limit && Number(limit)) || 20;
    const response = await this.adminService.fetchTestimonies(
      {
        page: intPage,
        limit: intLimit,
      },
      query?.status,
    );
    return {
      testimonies: response.data,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      },
      query,
    };
  }

  @Put('testimony/:uuid')
  async updateTestimony(
    @Param('uuid') uuid: string,
    @Body() body: dtos.UpdateTestimonyDto,
  ) {
    return this.adminService.updateTestimony(uuid, body);
  }
}

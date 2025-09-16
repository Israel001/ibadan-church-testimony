import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Render,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import * as dtos from './dto';
import { AdminAuthGuard } from './guards/auth-guard';
import { CreateCommentDto } from '../comment/comment.dto';
import { Response } from 'express';
import { AdminRoleGuard } from './guards/role-guard';
import { AdminRole } from 'src/decorators/admin_roles.decorator';

@Controller('admin')
@UseGuards(AdminAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Render('dashboard')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  async dashboard(@Session() session: any) {
    const result = await this.adminService.fetchDashboardData();
    const topTestimonies = await this.adminService.fetchToptestimonies();
    return { dashboardData: result, topTestimonies, session };
  }

  @Post('auth/login')
  @AllowUnauthorizedRequest()
  async login(@Body() body: dtos.AdminLoginDTO, @Session() session: any) {
    return this.adminService.login(body, session);
  }

  @Get('logout')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  logout(@Res() res: Response, @Session() session: any) {
    session.destroy((err: any) => {
      if (err) {
        return res.status(500).send('Could not log out');
      }
      res.redirect('/admin/sign-in');
    });
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

  @Get('view-moderator')
  @Render('view-moderator')
  @AdminRole({ roles: ['Super Admin'] })
  async viewModerator(@Session() session: any) {
    const moderators = await this.adminService.fetchModerators();
    return { moderators, session };
  }

  @Get('upload-testimony')
  @Render('upload-testimony')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  uploadTestimony(@Session() session: any) {
    return { session };
  }

  @Post('moderator')
  @AdminRole({ roles: ['Super Admin'] })
  createModerator(@Body() body: dtos.CreateModeratorDto) {
    return this.adminService.createModerator(body);
  }

  @Get('create-moderator')
  @Render('create-moderator')
  @AdminRole({ roles: ['Super Admin'] })
  signup(@Session() session: any) {
    return { session };
  }

  // @Get('moderators')
  // @AdminRole({ roles: ['Super Admin'] })
  // fetchModerators() {
  //   return this.adminService.fetchModerators();
  // }

  @Delete('moderator/:uuid')
  @AdminRole({ roles: ['Super Admin'] })
  deleteModerator(@Param('uuid') uuid: string) {
    return this.adminService.deleteModerator(uuid);
  }

  @Post('create-testimony')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  createTestimony(@Body() body: dtos.CreateAdminTestimonyDto) {
    return this.adminService.createTestimony(body);
  }

  @Post('category')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  createCategory(@Body() body: dtos.CreateCategoryDto) {
    return this.adminService.createCategory(body);
  }

  @Post('testimony/:uuid/comment')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  createComment(@Param('uuid') uuid: string, @Body() body: CreateCommentDto) {
    return this.adminService.createComment(uuid, body);
  }

  @Get('allcategories')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  async fetchCategories() {
    try {
      const response = await this.adminService.fetchCategories();
      return { categories: response };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [] };
    }
  }

  @Get('categories')
  @Render('categories')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  async fetchAllCategories(@Session() session: any) {
    try {
      const response = await this.adminService.fetchCategories();
      return { categories: response, session };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [], session };
    }
  }

  @Get('testimony/:uuid/comments')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  fetchComments(@Param('uuid') uuid: string) {
    return this.adminService.fetchComments(uuid);
  }

  @Put('category/:uuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  updateCategory(
    @Param('uuid') uuid: string,
    @Body() body: dtos.CreateCategoryDto,
  ) {
    return this.adminService.updateCategory(uuid, body);
  }

  @Put('testimony/:uuid/comments/:commentUuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  updateComment(
    @Param('commentUuid') commentUuid: string,
    @Body() body: dtos.UpdateCommentDto,
  ) {
    return this.adminService.updateComment(commentUuid, body);
  }

  @Delete('category/:uuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  deleteCategory(@Param('uuid') uuid: string) {
    return this.adminService.deleteCategory(uuid);
  }

  @Delete('testimony/:uuid/comments/:commentUuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  deleteComment(@Param('commentUuid') commentUuid: string) {
    return this.adminService.deleteComment(commentUuid);
  }

  @Get('view-testimony/:uuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  @Render('view_testimony')
  async viewTestimony(@Param('uuid') uuid: string, @Session() session: any) {
    const result = await this.adminService.fetchTestimony(uuid);
    return { result, session };
  }

  @Get('testimonies')
  @Render('testimonies')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  async fetchTestimonies(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: dtos.TestimonyQuery,
    @Session() session: any,
  ) {
    const intPage = (page && Number(page)) || 1;
    const intLimit = (limit && Number(limit)) || 20;
    const response = await this.adminService.fetchTestimonies(
      {
        page: intPage,
        limit: intLimit,
      },
      query?.status,
      query?.category,
    );
    return {
      testimonies: response.data,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      },
      query,
      session,
    };
  }

  @Put('testimony/:uuid')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  async updateTestimony(
    @Param('uuid') uuid: string,
    @Body() body: dtos.UpdateTestimonyDto,
  ) {
    return this.adminService.updateTestimony(uuid, body);
  }
}

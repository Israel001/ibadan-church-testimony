import { Body, Controller, Get, Param, Post, Query, Render, Req, Session, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import { AdminLocalAuthGuard } from './guards/local-auth-guard';
import * as dtos from './dto';
import { AdminJwtAuthGuard } from './guards/jwt-auth-guard';
import { AdminRoleGuard } from './guards/role-guard';

@Controller('admin')
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Render('dashboard')
  async dashboard(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Session() session: any,
  ) {
    const intPage = (page && Number(page)) || 1;
    const intLimit = (limit && Number(limit)) || 6;
    const response = await this.adminService.fetchTestimonies({
      page: intPage,
      limit: intLimit,
    });
    const loggedIn = !!session.userId;
    const unpublished = response.data.filter(
      (testimony: any) => !testimony.published,
    ).length;
    const published = response.data.filter(
      (testimony: any) => testimony.published,
    ).length;
    return {
      testimonies: response.data,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      },
      unpublished: unpublished,
      published: published,
      loggedIn,
    };
  }

  @Post('auth/login')
  @AllowUnauthorizedRequest()
  @UseGuards(AdminLocalAuthGuard)
  login(@Body() _body: dtos.AdminLoginDTO, @Req() req: any) {
    return this.adminService.login(req.user);
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

  @Get('view-testimony/:uuid')
  @Render('view_testimony')
  async viewTestimony(@Param('uuid') uuid: string) {
    const testimony = await this.adminService.fetchTestimony(uuid);
    console.log(testimony);
    return testimony;
  }
}

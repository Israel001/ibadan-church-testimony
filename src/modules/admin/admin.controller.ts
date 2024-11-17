import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import * as dtos from './dto';
import { Response } from 'express';
import { AdminAuthGuard } from './guards/auth-guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Render('dashboard')
  async dashboard(@Res() res: Response) {
    const result = await this.adminService.fetchDashboardData();
    return result;
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

  @Get('view-testimony/:uuid')
  @Render('view_testimony')
  async viewTestimony(@Param('uuid') uuid: string) {
    const testimony = await this.adminService.fetchTestimony(uuid);
    console.log(testimony);
    return testimony;
  }
}

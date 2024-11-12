import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @Render('dashboard')
  viewDashboard() {
    return {};
  }

  @Get('forgot-password')
  @Render('forgot-password')
  forgotPassword() {
    return {};
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPassword() {
    return {};
  }

  @Get('sign-in')
  @Render('sign-in')
  signIn() {
    return {};
  }

  @Get('sign-out')
  @Render('sign-out')
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

  @Get('view-testimony')
  @Render('view_testimony')
  viewTestimony() {
    return {};
  }
}

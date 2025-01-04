import { Body, Controller, Get, Post, Res, Session } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDTO, @Session() session: any) {
    return this.authService.login(body, session);
  }

  @Get('logout')
  logout(@Res() res: Response, @Session() session: any) {
    session.destroy((err: any) => {
      if (err) {
        return res.status(500).send('Could not log out');
      }
      res.redirect('/');
    });
  }
}

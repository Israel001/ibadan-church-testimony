import { Body, Controller, Post, Session } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() body: CreateUserDto, @Session() session: any) {
    return this.usersService.createUser(body, session);
  }
}

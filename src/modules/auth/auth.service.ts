import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EntityManager } from '@mikro-orm/core';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDTO } from './auth.dto';
import { Users } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}

  async login({ email, password }: LoginDTO, session: any) {
    const user = await this.validateUser(email, password);
    session.userId = user.uuid;
    session.firstName = user.fullname.split(' ')[0];
    session.lastName = user.fullname.split(' ')[1];
    session.email = user.email;
    return session;
  }

  async validateUser(emailOrPhone: string, password: string): Promise<Users> {
    const user = await this.usersService.findByEmailOrPhone(emailOrPhone);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      if (user.deletedAt)
        throw new ForbiddenException('This account is disabled');
      return user;
    }
    throw new UnauthorizedException('Invalid details');
  }
}

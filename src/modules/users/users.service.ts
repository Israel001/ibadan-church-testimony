import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { CreateUserDto } from './users.dto';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: EntityRepository<Users>,
    private readonly em: EntityManager,
  ) {}

  async createUser(user: CreateUserDto, session: any) {
    const existingUser = await this.usersRepository.findOne({
      email: user.email,
    });
    if (existingUser)
      throw new ConflictException(
        `User with email: ${user.email} already exist`,
      );
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const userModel = this.usersRepository.create({
      fullname: user.fullname,
      email: user.email,
      password: hashedPassword,
      uuid: v4(),
    });
    await this.em.persistAndFlush(userModel);
    session.userId = userModel.uuid;
    session.firstName = userModel.fullname.split(' ')[0];
    session.lastName = userModel.fullname.split(' ')[1];
    session.email = userModel.email;
    return { success: true, message: 'User registered and logged in' };
  }

  async findByEmailOrPhone(emailOrPhone: string) {
    return this.usersRepository.findOne({ email: emailOrPhone });
  }
}

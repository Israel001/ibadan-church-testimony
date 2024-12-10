import { Module } from '@nestjs/common';
import { TestimonyController } from './testimony.controller';
import { TestimonyService } from './testimony.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Testimony } from './testimony.entity';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';
import { UsersModule } from '../users/users.module';
import { CommentModule } from '../comment/comment.module';
import { AdminUser } from '../admin/admin.entities';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Testimony, Users, Category, Comment, AdminUser],
    }),
    UsersModule,
    CommentModule,
    SharedModule,
  ],
  controllers: [TestimonyController],
  providers: [TestimonyService],
  exports: [TestimonyService],
})
export class TestimonyModule {}

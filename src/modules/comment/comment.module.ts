import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Testimony } from '../testimony/testimony.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Comment, Testimony] })],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}

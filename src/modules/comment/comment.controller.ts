import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Session,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':testimonyUuid')
  async addComment(
    @Param('testimonyUuid') testimonyUuid: string,
    @Body() createCommentDto: CreateCommentDto,
    @Session() session: any,
  ) {
    return this.commentService.addComment(
      testimonyUuid,
      createCommentDto,
      session,
    );
  }

  @Get(':testimonyUuid')
  async fetchCommentsByTestimony(
    @Param('testimonyUuid') testimonyUuid: string,
  ) {
    return this.commentService.fetchCommentsByTestimony(testimonyUuid);
  }

  @Delete(':commentUuid')
  async deleteComment(@Param('commentUuid') commentUuid: string) {
    return this.commentService.deleteComment(commentUuid);
  }
}

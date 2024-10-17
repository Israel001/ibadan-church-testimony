import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':testimonyUuid')
  async addComment(
    @Param('testimonyUuid') testimonyUuid: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.addComment(testimonyUuid, createCommentDto);
  }

  @Get(':testimonyUuid')
  async fetchCommentsByTestimony(
    @Param('testimonyUuid') testimonyUuid: string,
  ) {
    return this.commentService.fetchCommentsByTestimony(testimonyUuid);
  }
}

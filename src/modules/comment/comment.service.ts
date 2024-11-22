import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { v4 } from 'uuid';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './comment.dto';
import { Testimony } from '../testimony/testimony.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    private readonly em: EntityManager,
  ) {}

  async addComment(testimonyUuid: string, createCommentDto: CreateCommentDto) {
    const testimony = await this.testimonyRepository.findOneOrFail({
      uuid: testimonyUuid,
    });
    if (!testimony) throw new NotFoundException('Testimony not found');
    const comment = this.commentRepository.create({
      uuid: v4(),
      name: createCommentDto.name,
      email: createCommentDto.email,
      comment: createCommentDto.comment,
      testimony,
    });

    await this.em.persistAndFlush(comment);
    return comment;
  }

  async fetchCommentsByTestimony(uuid: string) {
    const comments = await this.commentRepository.find({ testimony: uuid });
    return comments.map((comment) => ({
      uuid: comment.uuid,
      name: comment.name,
      email: comment.email,
      comment: comment.comment,
      createdAt: comment.createdAt,
    }));
  }
}

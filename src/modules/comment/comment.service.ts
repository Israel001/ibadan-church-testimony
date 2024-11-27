import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { v4 } from 'uuid';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './comment.dto';
import { Testimony } from '../testimony/testimony.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: EntityRepository<Comment>,
    @InjectRepository(Testimony)
    private readonly testimonyRepository: EntityRepository<Testimony>,
    @InjectRepository(Users)
    private readonly userRepository: EntityRepository<Users>,
    private readonly em: EntityManager,
  ) {}

  async addComment(
    testimonyUuid: string,
    createCommentDto: CreateCommentDto,
    session: any,
  ) {
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
      user: this.userRepository.getReference(session.userId),
    });

    await this.em.persistAndFlush(comment);
    return comment;
  }

  async fetchCommentsByTestimony(uuid: string) {
    const comments = await this.commentRepository.find({ testimony: uuid });
    return comments;
  }

  async deleteComment(uuid: string) {
    await this.commentRepository.nativeDelete({ uuid });
    return 'Comment deleted successfully';
  }
}

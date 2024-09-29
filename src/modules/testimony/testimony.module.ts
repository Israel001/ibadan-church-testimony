import { Module } from '@nestjs/common';
import { TestimonyController } from './testimony.controller';
import { TestimonyService } from './testimony.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Testimony } from './testimony.entity';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Testimony, Users, Category] })],
  controllers: [TestimonyController],
  providers: [TestimonyService],
  exports: [TestimonyService],
})
export class TestimonyModule {}

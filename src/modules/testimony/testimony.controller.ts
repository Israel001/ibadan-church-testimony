import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTestimonyDto } from './testimony.dto';
import { TestimonyService } from './testimony.service';
import { PaginationQuery } from 'src/base/dto';

@Controller('testimony')
@ApiTags('testimony')
@ApiBearerAuth()
export class TestimonyController {
  constructor(private readonly testimonyService: TestimonyService) {}

  @Post()
  create(@Body() body: CreateTestimonyDto, @Session() session: any) {
    return this.testimonyService.createTestimony(body, session);
  }

  @Get()
  fetchTestimonies(@Query() query: PaginationQuery) {
    return this.testimonyService.fetchTestimonies(query.pagination);
  }

  @Get(':uuid')
  fetchTestimony(@Param('uuid') uuid: string) {
    return this.testimonyService.fetchTestimony(uuid);
  }
}

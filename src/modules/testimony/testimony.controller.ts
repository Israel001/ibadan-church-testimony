import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
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
    console.log('query', query);
    return this.testimonyService.fetchTestimonies(query.pagination);
  }

  @Get(':uuid')
  fetchTestimony(@Param('uuid') uuid: string) {
    return this.testimonyService.fetchTestimony(uuid);
  }

  @Get('surround/:uuid')
  fetchSurroundingTestimonies(@Param('uuid') uuid: string) {
    return this.testimonyService.fetchTestimonyWithSurrounding(uuid);
  }

  @Get('category/get')
  fetchTestimoniesByCategory() {
    return this.testimonyService.getTestimoniesGroupedByCategory();
  }
}

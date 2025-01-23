import { Controller, Get, Param, Query, Render, Session } from '@nestjs/common';
import { TestimonyService } from './modules/testimony/testimony.service';
import { CategoryService } from './modules/category/category.service';

@Controller()
export class AppController {
  constructor(
    private readonly testimonyService: TestimonyService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @Render('index')
  async root(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Session() session: any,
  ) {
    const intPage = (page && Number(page)) || 1;
    const intLimit = (limit && Number(limit)) || 6;
    const response = await this.testimonyService.fetchTestimonies({
      page: intPage,
      limit: intLimit,
    });
    const categories = await this.categoryService.fetchCategories();
    const loggedIn = !!session.userId;
    return {
      testimonies: response.data,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      },
      categories,
      loggedIn,
      session,
    };
  }

  @Get('create-testimony')
  @Render('create-testimony')
  createTestimony(@Session() session: any) {
    return { session };
  }

  @Get('testimony/:uuid')
  @Render('view-testimony')
  async viewTestimony(@Param('uuid') uuid: string, @Session() session: any) {
    const loggedIn = !!session.userId;
    const testimonies =
      await this.testimonyService.fetchTestimonyWithSurrounding(uuid);
    return { loggedIn, testimonies, session };
  }
}

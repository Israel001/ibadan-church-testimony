import { Controller, Get, Param, Query, Render, Session } from '@nestjs/common';
import { TestimonyService } from './modules/testimony/testimony.service';

@Controller()
export class AppController {
  constructor(private readonly testimonyService: TestimonyService) {}

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
    const loggedIn = !!session.userId;
    return {
      testimonies: response.data,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.pages,
      },
      loggedIn,
    };
  }

  @Get('create-testimony')
  @Render('create-testimony')
  createTestimony(@Session() session: any) {
    console.log(session);
    return { session };
  }

  @Get('testimony/:uuid')
  @Render('view-testimony')
  async viewTestimony(@Param('uuid') uuid: string, @Session() session: any) {
    const loggedIn = !!session.userId;
    console.log("session", session);
    const testimonies =
      await this.testimonyService.fetchTestimonyWithSurrounding(uuid);
    return { loggedIn, testimonies, session };
  }
}

import { Body, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  fetchCategories() {
    return this.categoryService.fetchCategories();
  }
}

import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async fetchCategories() {
    try {
      const categories = await this.categoryService.fetchCategories();
      return { categories };
    } catch (err) {
      console.log('Error fetching categories:', err);
    }
  }

  @Post()
  createCategory(@Body() body: any) {
    try {
      const category = this.categoryService.createCategory(body);
      return { category };
    } catch (err) {
      console.log(err);
    }
  }
}

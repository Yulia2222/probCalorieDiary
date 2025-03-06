import { Controller, Post, Body, Get, Param, Query, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(@Body() productData: Partial<Product>): Promise<Product> {
        return this.productService.create(productData);
    }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Get(':userId/diary')
    async findByUserIdAndDate(
        @Param('userId') userId: number,
        @Query('date') date: string,
    ): Promise<Product[]> {
        return this.productService.findByUserIdAndDate(userId, date);
    }


    @Delete(':userId/remove-food')
    async removeProduct(
        @Param('userId') userId: number,
        @Body() data: { date: string; mealType: string; foodName: string },
    ): Promise<{ message: string }> {
        await this.productService.removeProduct(userId, data);
        return { message: 'Product removed successfully' };
    }
}

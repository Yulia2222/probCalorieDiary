import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    async create(productData: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOne(id: number): Promise<Product | null> {
        return this.productRepository.findOne({ where: { id } });
    }

    async findByUserIdAndDate(userId: number, date: string): Promise<Product[]> {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        return this.productRepository.find({
            where: {
                addedBy: { id: userId },
                createdAt: Between(startDate, endDate),
            },
            relations: ['addedBy'],
        });
    }

    async removeProduct(
        userId: number,
        data: { date: string; mealType: string; foodName: string },
    ): Promise<void> {
        const startDate = new Date(data.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const productToRemove = await this.productRepository.findOne({
            where: {
                addedBy: { id: userId },
                createdAt: Between(startDate, endDate),
                name: data.foodName,
            },
        });

        if (productToRemove) {
            await this.productRepository.remove(productToRemove);
        }
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: JwtPayload,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      addedBy: {
        id: user.sub,
        name: user.name,
        email: user.email,
      } as UserEntity,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      relations: ['addedBy'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findOneById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['addedBy'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOneById(id);

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<CategoryEntity> {
    const category = await this.findOneById(id);

    return await this.categoryRepository.softRemove(category);
  }
}

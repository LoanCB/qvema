import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ProjectCategory } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'E-commerce Platform' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'A modern e-commerce platform with advanced features' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 50000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ enum: ProjectCategory, example: ProjectCategory.TECHNOLOGY })
  @IsNotEmpty()
  @IsEnum(ProjectCategory)
  category: ProjectCategory;
}

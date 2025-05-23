import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({ example: 1, description: 'Project ID to invest in' })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({ example: 1000, description: 'Amount to invest' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}

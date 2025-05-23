import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class UpdateUserInterestsDto {
  @ApiProperty({ example: [1, 2, 3], description: 'Array of interest IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';
import { Role } from '../types/role.types';

export class CreateUserDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Min(8)
  @Max(31)
  password: string;

  @ApiProperty()
  @Min(8)
  @Max(31)
  confirmPassword: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Role of the user', enum: Role, example: Role.ADMIN })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

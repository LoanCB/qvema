import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@src/user/types/role.types';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Max, Min, Validate } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

class PasswordMatchConstraint {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue = (args.object as Record<string, string>)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as string[];
    return `${relatedPropertyName} and confirmPassword must match`;
  }
}

export class RegisterDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Min(8)
  @Max(31)
  password: string;

  @ApiProperty()
  @Min(8)
  @Max(31)
  @Validate(PasswordMatchConstraint, ['password'])
  confirmPassword: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Role of the user', enum: Role, example: Role.BUSINESS_MAN })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

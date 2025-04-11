import { TimestampEntity } from '@common/entities/timestamp.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { Role } from '../types/role.types';

export class UserEntity extends TimestampEntity {
  @ApiProperty({ example: 'john.doe@foo.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ enum: Role, example: Role.BUSINESS_MAN })
  @Column({ type: 'enum', enum: Role })
  role: Role;
}

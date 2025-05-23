import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from '@src/auth/helpers/password.utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { UserEmailAlreadyExistsException } from '../helpers/user.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async emailAlreadyExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email }, withDeleted: true });
    return count > 0;
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect([
        'user.id',
        'user.createdAt',
        'user.updatedAt',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.password',
      ])
      .where('user.email = :email', { email })
      .withDeleted()
      .getOne();
  }

  async create(dto: CreateUserDto) {
    const isUserExists = await this.emailAlreadyExists(dto.email);
    if (isUserExists) throw new UserEmailAlreadyExistsException({ email: dto.email });

    // Hash password
    const hashedPassword = Password.hash(dto.password);

    const createdUser = await this.userRepository.save({ ...dto, password: hashedPassword });
    const { password: _, ...user } = createdUser;
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const { email, password } = dto;
    if (email) {
      const existingUser = await this.userRepository.findOneBy({ email });
      if (existingUser && existingUser.id !== id) {
        throw new UserEmailAlreadyExistsException({ email });
      }
    }

    const hashedPassword = password ? Password.hash(password) : undefined;
    await this.userRepository.update(id, { ...dto, password: hashedPassword });
  }

  async deleteOne(id: number) {
    await this.userRepository.delete({ id });
  }
}

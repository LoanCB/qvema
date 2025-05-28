import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Interest } from '../entities/interest.entity';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Interest[]> {
    return await this.interestRepository.find();
  }

  async findByIds(ids: number[]): Promise<Interest[]> {
    const interests = await this.interestRepository.findByIds(ids);
    if (interests.length !== ids.length) {
      throw new NotFoundException('One or more interests not found');
    }
    return interests;
  }

  async updateUserInterests(userId: string, interestIds: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const interests = await this.findByIds(interestIds);
    user.interests = interests;
    return await this.userRepository.save(user);
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.interests;
  }
}

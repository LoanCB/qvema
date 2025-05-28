import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@src/project/entities/project.entity';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/user/types/role.types';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { Investment } from '../entities/investment.entity';

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, investorId: string): Promise<Investment> {
    const project = await this.projectRepository.findOne({
      where: { id: createInvestmentDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const investor = await this.userRepository.findOne({
      where: { id: investorId },
    });

    if (!investor || investor.role !== Role.INVESTOR) {
      throw new UnauthorizedException('Only investors can make investments');
    }

    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      investorId,
      projectId: createInvestmentDto.projectId,
    });

    return await this.investmentRepository.save(investment);
  }

  async findInvestorInvestments(investorId: string): Promise<Investment[]> {
    return await this.investmentRepository.find({
      where: { investorId },
      relations: ['project', 'investor'],
    });
  }

  async findProjectInvestments(projectId: string, userId: string): Promise<Investment[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (project.ownerId !== userId && user.role !== Role.ADMIN) {
      throw new UnauthorizedException('You can only view investments for your own projects');
    }

    return await this.investmentRepository.find({
      where: { projectId },
      relations: ['investor', 'project'],
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['investor'],
    });

    if (!investment) {
      throw new NotFoundException('Investment not found');
    }

    if (investment.investorId !== userId) {
      throw new UnauthorizedException('You can only cancel your own investments');
    }

    await this.investmentRepository.remove(investment);
  }
}

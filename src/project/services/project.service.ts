import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: number): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      ownerId,
    });
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, ownerId: number): Promise<Project> {
    const project = await this.findOne(id);

    if (project.ownerId !== ownerId) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const project = await this.findOne(id);

    if (!isAdmin && project.ownerId !== userId) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.projectRepository.remove(project);
  }

  async findRecommended(userId: number): Promise<Project[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all projects
    const allProjects = await this.projectRepository.find({
      relations: ['owner'],
    });

    // Filter projects based on user interests
    return allProjects.filter((project) => {
      // If user has no interests, return all projects
      if (!user.interests || user.interests.length === 0) {
        return true;
      }

      // Check if project category matches any of user's interests
      return user.interests.some((interest) => interest.name.toLowerCase() === project.category.toLowerCase());
    });
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@src/auth/decorators/role.decorator';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { LoggedUser } from '@src/auth/types/logged-user.type';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/user/types/role.types';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../services/project.service';

@Controller({ path: 'projects', version: ['1'] })
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.BUSINESS_MAN)
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: LoggedUser): Promise<Project> {
    return this.projectService.create(createProjectDto, user.id);
  }

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get('recommended')
  findRecommended(@GetUser() user: LoggedUser): Promise<Project[]> {
    return this.projectService.findRecommended(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.BUSINESS_MAN)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @GetUser() user: User): Promise<Project> {
    return this.projectService.update(id, updateProjectDto, user.id);
  }

  @Delete(':id')
  @Roles(Role.BUSINESS_MAN, Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: LoggedUser): Promise<void> {
    const isAdmin = user.role === Role.ADMIN;
    return this.projectService.remove(id, user.id, isAdmin);
  }
}

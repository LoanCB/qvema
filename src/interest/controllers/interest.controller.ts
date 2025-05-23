import { Controller, Get } from '@nestjs/common';
import { Interest } from '../entities/interest.entity';
import { InterestService } from '../services/interest.service';

@Controller({ path: 'interests', version: ['1'] })
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Get()
  findAll(): Promise<Interest[]> {
    return this.interestService.findAll();
  }
}

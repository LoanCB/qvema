import { SetMetadata } from '@nestjs/common';
import { Role } from '@src/user/types/role.types';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

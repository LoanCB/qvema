import { input, password as inquirerPassword, select } from '@inquirer/prompts';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Password } from '@src/auth/helpers/password.utils';
import { User } from '@src/user/entities/user.entity';
import { Role } from '@src/user/types/role.types';
import { DataSource } from 'typeorm';
import { CliModule } from './script.module';

const createUser = async () => {
  const appContext = await NestFactory.createApplicationContext(CliModule);
  const logger = new Logger('CREATE USER');

  try {
    const dataSource = appContext.get(DataSource);
    const userRepository = dataSource.getRepository(User);

    const firstName = await input({ message: 'First name : ', default: 'admin', required: true });
    const lastName = await input({ message: 'Last name : ', default: 'Admin', required: true });
    const email = await input({
      message: 'Email : ',
      default: 'admin@admin.com',
      required: true,
      validate: async (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) return 'Please enter a valid email address';
        const existingUser = await userRepository.findOne({ where: { email: input } });
        return !existingUser || 'Email already exists';
      },
    });

    const password = await inquirerPassword({
      message: 'Password : ',
      mask: '*',
      validate: (input) => (input.length > 0 ? true : 'Password is required'),
    });
    const hashedPassword = Password.hash(password);

    const role = await select({
      message: 'Role',
      choices: [
        {
          name: 'Administrator',
          value: Role.ADMIN,
        },
        {
          name: 'Investor',
          value: Role.INVESTOR,
        },
        {
          name: 'Business man',
          value: Role.BUSINESS_MAN,
        },
      ],
    });

    const createdUser = await userRepository.save({ firstName, lastName, email, password: hashedPassword, role });
    logger.verbose(`User successfully created and have id ${createdUser.id}`);
  } catch (error) {
    logger.error('Error during creation of the user : ', error instanceof Error ? error.message : 'unknown error');
  } finally {
    await appContext.close();
  }
};

void createUser();

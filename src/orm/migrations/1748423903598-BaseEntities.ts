import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseEntities1748423903598 implements MigrationInterface {
  name = 'BaseEntities1748423903598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "interest" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "name" character varying NOT NULL,
            "description" character varying,
            CONSTRAINT "UQ_2182a5960e5a00b0a3920b46f48" UNIQUE ("name"),
            CONSTRAINT "PK_6619d627e204e0596968653011f" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TYPE "public"."user_role_enum" AS ENUM('BUSINESS_MAN', 'INVESTOR', 'ADMIN')
    `);
    await queryRunner.query(`
        CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "first_name" character varying NOT NULL,
            "last_name" character varying NOT NULL,
            "role" "public"."user_role_enum" NOT NULL,
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TYPE "public"."project_category_enum" AS ENUM(
            'TECHNOLOGY',
            'HEALTHCARE',
            'EDUCATION',
            'FINANCE',
            'REAL_ESTATE',
            'OTHER'
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "project" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "title" character varying NOT NULL,
            "description" text NOT NULL,
            "budget" numeric(10, 2) NOT NULL,
            "category" "public"."project_category_enum" NOT NULL DEFAULT 'OTHER',
            "owner_id" uuid NOT NULL,
            CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "investment" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "amount" numeric(10, 2) NOT NULL,
            "investor_id" uuid NOT NULL,
            "project_id" uuid NOT NULL,
            CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user_interests_interest" (
            "user_id" uuid NOT NULL,
            "interest_id" uuid NOT NULL,
            CONSTRAINT "PK_680ab37504fa47943eb7b452aed" PRIMARY KEY ("user_id", "interest_id")
        )
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_2d154090d9c62fef47bcd612e2" ON "user_interests_interest" ("user_id")
    `);
    await queryRunner.query(`
        CREATE INDEX "IDX_65e9b39d2ab2dad56d7886ac5e" ON "user_interests_interest" ("interest_id")
    `);
    await queryRunner.query(`
        ALTER TABLE "project"
        ADD CONSTRAINT "FK_d40afe32d1d771bea7a5f468185" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "investment"
        ADD CONSTRAINT "FK_186ea00eb9820c93f9a7fe045be" FOREIGN KEY ("investor_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "investment"
        ADD CONSTRAINT "FK_6a3639a85a24759b59a06a2e499" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
        ALTER TABLE "user_interests_interest"
        ADD CONSTRAINT "FK_2d154090d9c62fef47bcd612e21" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "user_interests_interest"
        ADD CONSTRAINT "FK_65e9b39d2ab2dad56d7886ac5e8" FOREIGN KEY ("interest_id") REFERENCES "interest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_interests_interest" DROP CONSTRAINT "FK_65e9b39d2ab2dad56d7886ac5e8"
    `);
    await queryRunner.query(`
        ALTER TABLE "user_interests_interest" DROP CONSTRAINT "FK_2d154090d9c62fef47bcd612e21"
    `);
    await queryRunner.query(`
        ALTER TABLE "investment" DROP CONSTRAINT "FK_6a3639a85a24759b59a06a2e499"
    `);
    await queryRunner.query(`
        ALTER TABLE "investment" DROP CONSTRAINT "FK_186ea00eb9820c93f9a7fe045be"
    `);
    await queryRunner.query(`
        ALTER TABLE "project" DROP CONSTRAINT "FK_d40afe32d1d771bea7a5f468185"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_65e9b39d2ab2dad56d7886ac5e"
    `);
    await queryRunner.query(`
        DROP INDEX "public"."IDX_2d154090d9c62fef47bcd612e2"
    `);
    await queryRunner.query(`
        DROP TABLE "user_interests_interest"
    `);
    await queryRunner.query(`
        DROP TABLE "investment"
    `);
    await queryRunner.query(`
        DROP TABLE "project"
    `);
    await queryRunner.query(`
        DROP TYPE "public"."project_category_enum"
    `);
    await queryRunner.query(`
        DROP TABLE "user"
    `);
    await queryRunner.query(`
        DROP TYPE "public"."user_role_enum"
    `);
    await queryRunner.query(`
        DROP TABLE "interest"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitPluginOtp1693988733320 implements MigrationInterface {
  name = 'InitPluginOtp1693988733320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "otp" (
        "id" BIGSERIAL NOT NULL,
        "subject" text NOT NULL,
        "type" text NOT NULL,
        "hash" text NOT NULL,
        "cooldown" integer NOT NULL DEFAULT '100',
        "retryCount" integer NOT NULL DEFAULT '0',
        "maxRetryCount" integer NOT NULL,
        "metadata" jsonb,
        "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_88a700f7a3c1bd73195ee3e8b1d" UNIQUE ("subject", "type"),
        CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id")
      )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "otp"
      `);
  }
}

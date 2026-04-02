import type { MigrationInterface, QueryRunner } from 'typeorm';

export class FormMetadataSchema1743581000000 implements MigrationInterface {
  name = 'FormMetadataSchema1743581000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "form_section_configs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "form_key" varchar(100) NOT NULL,
        "entity" varchar(100) NOT NULL,
        "version" varchar(20) NOT NULL,
        "section_key" varchar(100) NOT NULL,
        "label" varchar(150) NOT NULL,
        "description" text NOT NULL,
        "display_order" integer NOT NULL,
        CONSTRAINT "uq_form_section_configs_form_key_section_key"
          UNIQUE ("form_key", "section_key")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "form_field_configs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "form_key" varchar(100) NOT NULL,
        "entity" varchar(100) NOT NULL,
        "version" varchar(20) NOT NULL,
        "field_key" varchar(150) NOT NULL,
        "section" varchar(100) NOT NULL,
        "label" varchar(150) NOT NULL,
        "required" boolean NOT NULL,
        "importance" varchar(20) NOT NULL,
        "input_type" varchar(30) NOT NULL,
        "data_type" varchar(20) NOT NULL,
        "multiple" boolean NOT NULL,
        "computed" boolean NOT NULL,
        "read_only" boolean NOT NULL,
        "display_order" integer NOT NULL,
        "visible_when" jsonb NULL,
        "description" text NOT NULL,
        "business_impact" text NOT NULL,
        "placeholder" varchar(255) NULL,
        "mask" varchar(50) NULL,
        "options_source" varchar(100) NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_form_field_configs_form_key_field_key"
          UNIQUE ("form_key", "field_key")
      )
    `);

    await queryRunner.query('CREATE INDEX "idx_form_field_configs_form_key" ON "form_field_configs" ("form_key")');
    await queryRunner.query('CREATE INDEX "idx_form_field_configs_section" ON "form_field_configs" ("section")');
    await queryRunner.query('CREATE INDEX "idx_form_section_configs_form_key" ON "form_section_configs" ("form_key")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "idx_form_section_configs_form_key"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_form_field_configs_section"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_form_field_configs_form_key"');
    await queryRunner.query('DROP TABLE IF EXISTS "form_field_configs"');
    await queryRunner.query('DROP TABLE IF EXISTS "form_section_configs"');
  }
}

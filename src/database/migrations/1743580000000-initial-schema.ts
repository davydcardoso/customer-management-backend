import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1743580000000 implements MigrationInterface {
  name = 'InitialSchema1743580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "username" varchar(100) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token_hash" varchar(255) NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "revoked_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "person_type" varchar(20) NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "customer_since" date NULL,
        "classification" varchar(100) NULL,
        "referral_source" varchar(100) NULL,
        "referral_name" varchar(255) NULL,
        "allows_invoice" boolean NOT NULL DEFAULT false,
        "has_restriction" boolean NOT NULL DEFAULT false,
        "is_final_consumer" boolean NOT NULL DEFAULT false,
        "is_rural_producer" boolean NOT NULL DEFAULT false,
        "notes" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_individual_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL UNIQUE REFERENCES "customers"("id") ON DELETE CASCADE,
        "cpf" varchar(14) NOT NULL UNIQUE,
        "rg" varchar(20) NULL,
        "full_name" varchar(255) NOT NULL,
        "nickname" varchar(255) NULL,
        "birth_date" date NULL,
        "gender" varchar(50) NULL,
        "family_relationship" varchar(100) NULL,
        "profession" varchar(100) NULL,
        "driver_license_expires_at" date NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_company_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL UNIQUE REFERENCES "customers"("id") ON DELETE CASCADE,
        "cnpj" varchar(18) NOT NULL UNIQUE,
        "state_registration" varchar(50) NULL,
        "corporate_name" varchar(255) NOT NULL,
        "trade_name" varchar(255) NOT NULL,
        "municipal_registration" varchar(50) NULL,
        "suframa_registration" varchar(50) NULL,
        "taxpayer_type" varchar(100) NULL,
        "opening_date" date NULL,
        "company_segment" varchar(100) NULL,
        "iss_withheld" boolean NOT NULL DEFAULT false
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_financial_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL UNIQUE REFERENCES "customers"("id") ON DELETE CASCADE,
        "credit_limit" numeric(14,2) NULL,
        "amount_spent" numeric(14,2) NULL,
        "balance" numeric(14,2) NULL,
        "consumed_amount" numeric(14,2) NULL,
        "cost_amount" numeric(14,2) NULL,
        "profitability_amount" numeric(14,2) NULL,
        "profitability_percentage" numeric(5,2) NULL,
        "commission_percentage" numeric(5,2) NULL,
        "payment_day" integer NULL,
        "pix_key_or_description" varchar(255) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_addresses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL UNIQUE REFERENCES "customers"("id") ON DELETE CASCADE,
        "zip_code" varchar(20) NULL,
        "street" varchar(255) NULL,
        "number" varchar(50) NULL,
        "complement" varchar(255) NULL,
        "district" varchar(100) NULL,
        "city" varchar(100) NULL,
        "state" varchar(100) NULL,
        "city_code" varchar(50) NULL,
        "state_code" varchar(50) NULL,
        "reference" varchar(255) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_contacts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "value" varchar(50) NOT NULL,
        "type" varchar(30) NOT NULL,
        "is_whatsapp" boolean NOT NULL DEFAULT false,
        "label" varchar(100) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_emails" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "email" varchar(255) NOT NULL,
        "label" varchar(100) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "customer_communication_preferences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "channel" varchar(30) NOT NULL,
        "topic" varchar(50) NOT NULL,
        "enabled" boolean NOT NULL DEFAULT true
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "responsibles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
        "full_name" varchar(255) NOT NULL,
        "cpf" varchar(14) NULL,
        "rg" varchar(20) NULL,
        "nickname" varchar(255) NULL,
        "birth_date" date NULL,
        "gender" varchar(50) NULL,
        "family_relationship" varchar(100) NULL,
        "role" varchar(100) NULL,
        "profession" varchar(100) NULL,
        "driver_license_expires_at" date NULL,
        "active" boolean NOT NULL DEFAULT true,
        "customer_since" date NULL,
        "referral_source" varchar(100) NULL,
        "referral_name" varchar(255) NULL,
        "notes" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "responsible_addresses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "responsible_id" uuid NOT NULL UNIQUE REFERENCES "responsibles"("id") ON DELETE CASCADE,
        "zip_code" varchar(20) NULL,
        "street" varchar(255) NULL,
        "number" varchar(50) NULL,
        "complement" varchar(255) NULL,
        "district" varchar(100) NULL,
        "city" varchar(100) NULL,
        "state" varchar(100) NULL,
        "city_code" varchar(50) NULL,
        "state_code" varchar(50) NULL,
        "reference" varchar(255) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "responsible_contacts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "responsible_id" uuid NOT NULL REFERENCES "responsibles"("id") ON DELETE CASCADE,
        "value" varchar(50) NOT NULL,
        "type" varchar(30) NOT NULL,
        "is_whatsapp" boolean NOT NULL DEFAULT false,
        "label" varchar(100) NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "responsible_emails" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "responsible_id" uuid NOT NULL REFERENCES "responsibles"("id") ON DELETE CASCADE,
        "email" varchar(255) NOT NULL,
        "label" varchar(100) NULL
      )
    `);

    await queryRunner.query('CREATE INDEX "idx_customers_person_type" ON "customers" ("person_type")');
    await queryRunner.query('CREATE INDEX "idx_customers_deleted_at" ON "customers" ("deleted_at")');
    await queryRunner.query('CREATE INDEX "idx_customer_contacts_customer_id" ON "customer_contacts" ("customer_id")');
    await queryRunner.query('CREATE INDEX "idx_customer_emails_customer_id" ON "customer_emails" ("customer_id")');
    await queryRunner.query(
      'CREATE INDEX "idx_customer_comm_prefs_customer_id" ON "customer_communication_preferences" ("customer_id")',
    );
    await queryRunner.query('CREATE INDEX "idx_responsibles_customer_id" ON "responsibles" ("customer_id")');
    await queryRunner.query(
      'CREATE INDEX "idx_responsible_contacts_responsible_id" ON "responsible_contacts" ("responsible_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "idx_responsible_emails_responsible_id" ON "responsible_emails" ("responsible_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "idx_responsible_emails_responsible_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_responsible_contacts_responsible_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_responsibles_customer_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_customer_comm_prefs_customer_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_customer_emails_customer_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_customer_contacts_customer_id"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_customers_deleted_at"');
    await queryRunner.query('DROP INDEX IF EXISTS "idx_customers_person_type"');

    await queryRunner.query('DROP TABLE IF EXISTS "responsible_emails"');
    await queryRunner.query('DROP TABLE IF EXISTS "responsible_contacts"');
    await queryRunner.query('DROP TABLE IF EXISTS "responsible_addresses"');
    await queryRunner.query('DROP TABLE IF EXISTS "responsibles"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_communication_preferences"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_emails"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_contacts"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_addresses"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_financial_profiles"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_company_profiles"');
    await queryRunner.query('DROP TABLE IF EXISTS "customer_individual_profiles"');
    await queryRunner.query('DROP TABLE IF EXISTS "customers"');
    await queryRunner.query('DROP TABLE IF EXISTS "refresh_tokens"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}

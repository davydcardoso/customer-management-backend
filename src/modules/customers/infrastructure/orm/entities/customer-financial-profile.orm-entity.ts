import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CustomerOrmEntity } from './customer.orm-entity';

@Entity({ name: 'customer_financial_profiles' })
export class CustomerFinancialProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_id', type: 'uuid', unique: true })
  customerId!: string;

  @OneToOne(() => CustomerOrmEntity, (customer) => customer.financialProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerOrmEntity;

  @Column({ name: 'credit_limit', type: 'numeric', precision: 14, scale: 2, nullable: true })
  creditLimit!: string | null;

  @Column({ name: 'amount_spent', type: 'numeric', precision: 14, scale: 2, nullable: true })
  amountSpent!: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  balance!: string | null;

  @Column({ name: 'consumed_amount', type: 'numeric', precision: 14, scale: 2, nullable: true })
  consumedAmount!: string | null;

  @Column({ name: 'cost_amount', type: 'numeric', precision: 14, scale: 2, nullable: true })
  costAmount!: string | null;

  @Column({ name: 'profitability_amount', type: 'numeric', precision: 14, scale: 2, nullable: true })
  profitabilityAmount!: string | null;

  @Column({
    name: 'profitability_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  profitabilityPercentage!: string | null;

  @Column({
    name: 'commission_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  commissionPercentage!: string | null;

  @Column({ name: 'payment_day', type: 'integer', nullable: true })
  paymentDay!: number | null;

  @Column({ name: 'pix_key_or_description', type: 'varchar', length: 255, nullable: true })
  pixKeyOrDescription!: string | null;
}

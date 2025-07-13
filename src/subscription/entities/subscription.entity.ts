// subscription.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serviceName: string;

    @Column()
    webhookUrl: string;

    @Column()
    authToken: string;

    @Column({ default: true })
    isActive: boolean;
}
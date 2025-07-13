import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ErrorLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serviceName: string;

    @Column({ type: 'text' })
    errorMessage: string;

    @Column({ type: 'text', nullable: true })
    stackTrace?: string;

    @Column({ default: 1 })
    count: number;

    @CreateDateColumn()
    timestamp: Date;

    @CreateDateColumn()
    firstOccurrence: Date;

    @UpdateDateColumn()
    lastOccurrence: Date;

    @Column({ unique: true })
    errorHash: string;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    timestamp: Date;
}
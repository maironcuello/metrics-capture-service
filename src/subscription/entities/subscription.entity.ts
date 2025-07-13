import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Nombre descriptivo (ej: "ServiceNow Tickets")

    @Column()
    targetUrl: string; // URL del webhook

    @Column({ type: 'json' })
    events: string[]; // Tipos de eventos a suscribir (ej: ["error", "warning"])

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    secretKey: string; // Clave para firmar payloads

    @Column({ type: 'int', default: 0 })
    retryCount: number; // Contador de reintentos

    @Column({ nullable: true })
    lastError: string; // Último error de entrega

    @CreateDateColumn()
    createdAt: Date;
}
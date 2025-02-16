import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ErrorLog } from './error-log.entity';

@WebSocketGateway()
export class ErrorCaptureGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    handleEvent(@MessageBody() message: string): void {
        this.server.emit('events', message);
    }

    async handleConnection(client: any, ...args: any[]) {
        console.log('Client connected');
    }

    async handleDisconnect(client: any) {
        console.log('Client disconnected');
    }

    broadcastError(error: ErrorLog) {
        this.server.emit('newError', error);
    }
}
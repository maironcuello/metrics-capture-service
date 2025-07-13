import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SomeService {
    constructor(private readonly httpService: HttpService) { }

    async someMethod() {
        try {
            // Código que puede lanzar un error
        } catch (error) {
            const errorLog = {
                serviceName: 'SomeService',
                errorMessage: error.message,
                stackTrace: error.stack,
            };

            await firstValueFrom(
                this.httpService.post('http://localhost:3000/error-capture/capture', errorLog),
            );
        }
    }
}
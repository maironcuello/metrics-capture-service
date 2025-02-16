import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = 'Internal Server Error';
        let code = 'HttpException';
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof QueryFailedError) {
            message = exception.message;
            status = HttpStatus.UNPROCESSABLE_ENTITY;
        } else if (exception instanceof EntityNotFoundError) {
            message = exception.message;
            status = HttpStatus.NOT_FOUND;
        }

        const stack = exception instanceof Error ? exception.stack : '';
        Logger.error(message, stack, `${request.method} ${request.url}`);
        response.status(status).json({ statusCode: status, message, code });
    }
}
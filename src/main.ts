import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import * as http2 from 'http2';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';

const logger = new Logger('metrics-capture-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Configurar CORS
  // app.enableCors({
  //   origin: configService.get<string>('CORS_ORIGIN'),
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  
  // app.useGlobalFilters(new GlobalExceptionFilter());

  // Servir archivos estáticos de la aplicación React
  // app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  
    // Permitir que las rutas de la API se manejen normalmente
    // Redirigir todas las rutas que no son de la API a la aplicación React
    // app.use((req, res, next) => {
    //   if (req.originalUrl.startsWith('/api')) {
    //     next(); 
    //   } else {
    //     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    //   }
    // });

  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/private-key.pem'),
  //   cert: fs.readFileSync('./secrets/public-certificate.pem'),
  //   allowHTTP1: true // Acepta tanto HTTP/1.1 como HTTP/2
  // };

  // const server = http2.createSecureServer(
  //   httpsOptions,
  //   app.getHttpAdapter().getInstance()
  // );

  const PORT = 3000;
  await app.listen(PORT);
  logger.log(`Application is running on: ${PORT}`);
}
bootstrap();

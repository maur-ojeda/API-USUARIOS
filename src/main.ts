import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Gestión de Usuarios')
    .setDescription(
      'API para gestión de usuarios, perfiles, direcciones y atributos',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const dataSource = app.get(DataSource);
  const roleRepository = dataSource.getRepository(Role);

  const existingRoles = await roleRepository.count();
  if (existingRoles === 0) {
    const roles = [
      { name: 'ADMIN', description: 'Administrator with full access' },
      { name: 'USER', description: 'Regular user with basic access' },
      { name: 'EDITOR', description: 'Editor with content management access' },
    ];
    await roleRepository.save(roles);
    console.log('Initial roles created');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
  console.log(
    `Admin API: http://localhost:${port}/admin/* (requires JWT with ADMIN role)`,
  );
}
bootstrap();

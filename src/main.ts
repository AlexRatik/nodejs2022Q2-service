import { NestFactory } from '@nestjs/core';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const DOCS_FILE = join(cwd(), 'doc', 'api.yaml');
  const DOCS_DATA = await readFile(DOCS_FILE, 'utf-8');
  const document = parse(DOCS_DATA);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();

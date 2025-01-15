import { NestFactory } from '@nestjs/core';
import { SharedModule } from './shared.module';

async function bootstrap() {
  const app = await NestFactory.create(SharedModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  // Configurar el tamaño máximo del cuerpo a 50mb
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Habilitar CORS para todos los orígenes
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

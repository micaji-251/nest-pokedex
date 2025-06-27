import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //solo permite que puedas ver la data que especificaste en el dto, lo demás no llega
      forbidNonWhitelisted: true, //Indica todo lo que no esta en el dto como prohibido de enviar
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ),
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

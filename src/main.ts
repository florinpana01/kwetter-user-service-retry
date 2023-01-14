import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
   // const app = await NestFactory.create(AppModule);
   // app.use(cookieParser());
   // app.enableCors({
   //    origin: 'http://localhost:8080',
   //    credentials: true
   // })
   // app.setGlobalPrefix('api');
   // await app.listen(8002);
   const app = await NestFactory.createMicroservice(AppModule, {
      transport: Transport.RMQ,
      options: {
         urls: ['amqps://iygyoums:Ff8WVU7zxhJdki1R5sGzOPrUadHTzQjZ@kangaroo.rmq.cloudamqp.com/iygyoums'],
         queue: "user-queue-gateway",
         queueOptions: {
            durable: false
         },
      },
   });
   app.listen();
}
bootstrap();

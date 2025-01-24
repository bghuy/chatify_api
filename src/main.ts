import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import * as dotenv from 'dotenv';
// dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send();
    } else {
      next();
    }
  });

  app.use(cookieParser());
  app.connectMicroservice({

  })
  await app.listen(process.env.PORT ?? 3000);

  // const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqps://orjnbmgw:pRl3Pn91eq0NPHe-o3k0svohbcRS_5Ec@fuji.lmq.cloudamqp.com/orjnbmgw'],
  //     queue: 'main_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });
  // microservice.listen();
  // console.log('Microservice is listening');
  
}

bootstrap();

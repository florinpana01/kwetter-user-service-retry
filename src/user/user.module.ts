import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Totamealand1983',
      database: 'kwetter-users',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
  TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '1d'}
  }),
  ClientsModule.register([
    {
      name: 'USER_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqps://iygyoums:Ff8WVU7zxhJdki1R5sGzOPrUadHTzQjZ@kangaroo.rmq.cloudamqp.com/iygyoums'],
        queue: "user-queue-gateway",
        queueOptions: {
          durable: false
        },
      },
    },
  ]),
],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

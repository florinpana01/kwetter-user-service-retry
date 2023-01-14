import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FollowModule } from './follow/follow.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

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
    UserModule, FollowModule,
  TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'secret',
    signOptions: {expiresIn: '1d'}
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

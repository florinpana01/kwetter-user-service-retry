import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Response, Request } from 'express';

@Controller('users')
export class UserController {
constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private client: ClientProxy,
    ) {

}
    @EventPattern('user_request_all')
    async all() {
        console.log('getting all users');
        return this.userService.all();
    }


    @EventPattern('user_created_gateway')
    async register(data) {
        console.log("user_created_gateway data", data);
        const newUser = await this.userService.create(data);
        this.client.emit('user_created', newUser);
        return newUser;
    }

     @EventPattern('user_login_gateway')
     async login(data) {
         console.log("user_login_gateway data", data);
         const user = await this.userService.findOne(data);
         console.log(user);
         //this.client.emit('user_login_gateway', user);
         return user;
     }

    @EventPattern('user_logout_gateway')
    async logout(data) {
        console.log("logged_out_user_gateway data", data);
        const post = await this.userService.create(data);
        this.client.emit('logged_out_user', post);
        return post;
    }
}

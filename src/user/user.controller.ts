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

    // @Get()
    // all() {
    //     return this.userService.all();
    // }

    // @EventPattern('hello')
    // async hello(data: string){
    //     console.log(data);
    // }

    // @Post('register')
    // async register(
    //     @Body('email') email: string,
    //     @Body('firstName') firstName: string,
    //     @Body('lastName') lastName: string,
    //     @Body('username') username: string,
    //     @Body('password') password: string
    // ) {
    //     const hashedPassword = await bcrypt.hash(password, 12);

    //     //stopping the password from being displayed on the response, for security reasons
    //     const user = await this.userService.create({
    //         email,
    //         firstName, 
    //         lastName,
    //         username,
    //         password: hashedPassword
    //     });

    //     delete user.password;
    //     return user; 
    // }
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

    // @Post('login')
    // async login(
    //     @Body('email') email: string,
    //     @Body('password') password: string,
    //     @Res({passthrough: true}) response: Response
    // ){
    //     const user = await this.userService.findOne({email});

    //     if(!user) {
    //         throw new BadRequestException('invalid credentials');
    //     }

    //     if(!await bcrypt.compare(password, user.password)){
    //         throw new BadRequestException('invalid credentials');
    //     }

    //     const jwt = await this.jwtService.signAsync({id: user.id});

    //     response.cookie('jwt', jwt, {httpOnly: true});

    //     return {
    //         message: 'success'
    //     };
    // }

     @EventPattern('user_login_gateway')
     async login(data) {
         console.log("user_login_gateway data", data);
         const user = await this.userService.findOne(data);
         console.log(user);
         //this.client.emit('user_login_gateway', user);
         return user;
     }

    // @Get('user')
    // async user(@Req() request: Request) {
    //     try{
    //     const cookie = request.cookies['jwt'];

    //     const data = await this.jwtService.verifyAsync(cookie);

    //     if(!data) {
    //         throw new UnauthorizedException();
    //     }

    //     const user = await this.userService.findOne({id: data['id']});

    //     //stopping the password from being displayed on the response, for security reasons

    //     const {password, ...result} = user;

    //     return result;
    //     }
    //     catch(e){
    //         throw new UnauthorizedException();
    //     }
    // }

    // @Post('logout')
    // async logout(@Res({passthrough: true}) response: Response
    // ){
    //     response.clearCookie('jwt');
    //     return {
    //         message: 'logged out'
    //     }
    // }

    @EventPattern('user_logout_gateway')
    async logout(data) {
        console.log("logged_out_user_gateway data", data);
        const post = await this.userService.create(data);
        this.client.emit('logged_out_user', post);
        return post;
    }
}

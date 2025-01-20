import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private service: AuthService){}

   @Post()
   getHello(@Body() data: any) {
     return this.service.auth_validar_usuarios(data);
   }
}

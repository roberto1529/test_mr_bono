import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private service: AuthService){}

   @Post('')
   login(@Body() data: any){
      return this.service.Login(data);
   }

   @Post('createUser')
   createUSer(@Body() data: any){
    return this.service.CreateUsuario(data);
   }

   @Put('UpdataUser')
   ActulizarUsuarios(@Body() data: any){
      return this.service.UpdateUser(data);
   }

   @Delete('DeleteUser')
   EliminarUsuarios(@Body() data: any){
      return this.service.UpdateUser(data);
   }
 /*   getHello(@Body() data: any) {
     return this.service.auth_validar_usuarios(data);
   } */
}

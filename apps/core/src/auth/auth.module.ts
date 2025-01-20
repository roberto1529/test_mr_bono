import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ValidatorSqlService } from 'apps/shared/services/Validator/injector.service';

@Module({
  controllers:[AuthController],
  providers: [AuthService, ValidatorSqlService]
})
export class AuthModule {}

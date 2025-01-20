import { Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as conf from './data/consulting.json'; // Importar archivo JSON
import { AuthInterface } from './types/auth.interfaces';
import { ValidatorSqlService } from 'apps/shared/services/Validator/injector.service';

@Injectable()
export class AuthService {
    constructor(private sequelize: Sequelize, private validator: ValidatorSqlService){}

    public async auth_validar_usuarios(data: AuthInterface){
        const transaction = await this.sequelize.transaction();
        let response;
        console.log('recibido=>', data);
        
          // Validar que los datos no contengan patrones de inyección SQL
        if (! await this.validator.isValidInput(data.usuario) || ! await this.validator.isValidInput(data.pass)) {
            console.error('Entrada no válida: posible intento de inyección SQL');
            response = {
              status: 505,
              data: 'Tu cuenta sera bloqueda para proteger tus datos.'
            }
            return response
         }
  
        try {
            
            const query = conf['$user_value'];
            const result = await this.sequelize.query(query, {
              type: QueryTypes.SELECT,
              replacements: {
                us: data.usuario, 
                pw: data.pass
              },
              raw: true
            });

            if (result.length > 0) {
                response = {
                    status: 200,
                    data: result
                }
            }else{
                response = {
                    status: 500,
                    data: 'Error usuario y/o clave invalida.'
                }
            }
            
            await  transaction.commit();
            return response;
        } catch (error) {
            await transaction.rollback();
            throw error; 
        }

    }



}

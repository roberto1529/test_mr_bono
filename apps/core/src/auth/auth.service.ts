import { Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as conf from './data/consulting.json'; // Importar archivo JSON
import { AuthInterface } from './types/auth.interfaces';
import { ValidatorSqlService } from 'apps/shared/services/Validator/injector.service';
import { query } from 'express';

@Injectable()
export class AuthService {
    constructor(private sequelize: Sequelize, private validator: ValidatorSqlService){}
/* 
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

    } */

     private ValidacionTipoUser(tipo):boolean{
        console.log('tipo', tipo);
        
         if (tipo === 1) {
             return true
         }
         return false
     }
   
     private ValidacionCorreo(correo): boolean {
         const expRegu = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
         let compracion = expRegu.test(correo);
   
         return compracion;
     }

    public async Login(data: any){
        
        const transaction = await this.sequelize.transaction();

        try {
            let _query = `select u.id_rol, r.nombre_rol from mr_bono.usuarios u
            join mr_bono.rol r on r.id  = u.id_rol 
            where u.correo = :cr and u.pass = :ps `;
            let result = await this.sequelize.query(_query, {
                replacements: {
                    cr: data.correo,
                    ps: data.pass
                },
                raw: true,
                type:  QueryTypes.SELECT 
            });

            console.log(result);
            
            transaction.commit()
            return result;
           
        } catch (error) {
            transaction.rollback()
        }
    }

    public async CreateUsuario(data){
        const transaction = await this.sequelize.transaction();

        try {
            if (this.ValidacionTipoUser(data.user_reg) !== true && !this.ValidacionCorreo(data.correo)) {
                return 'Valide la informacion enviada';
            } 
            
            let _qy = `INSERT INTO mr_bono.usuarios (nombre, correo, id_rol, pass) VALUES(:no, :co, :rl, :ps);`;
            await this.sequelize.query(_qy, {
                replacements: {
                    no: data.nombre,
                    co: data.correo,
                    rl: data.rol,
                    ps: data.pass
                }
            })

            transaction.commit();
            return  'Usuario Creado'
        } catch (error) {
            transaction.rollback()
        }
    }

    public async UpdateUser(data){
        const transaction = await this.sequelize.transaction();
        let user;
        console.log('correo', this.ValidacionCorreo(data.correo));
        
        try {
            
            if (this.ValidacionTipoUser(data.user_reg) === false  && !this.ValidacionCorreo(data.correo)) {
                return 'Valide la informacion enviada';
            } else{
                let _qy = `UPDATE mr_bono.usuarios SET nombre=:no, correo=:ml, id_rol=:rl, pass=:ps WHERE id= :id;`;
                await this.sequelize.query(_qy, {
                    replacements: {
                        id:data.id_user,
                        no:data.nombre,
                        ml:data.correo, 
                        ps:data.pass,
                        rl: data.rol
                    }
                });
                user = data.nombre;
    
                transaction.commit();
                return  `Usuario editado:  ${user}`
            }

        } catch (error) {
            transaction.rollback()
        }
    }

    public async DeleteUser(data){
        const transaction = await this.sequelize.transaction();
        console.log('correo', this.ValidacionCorreo(data.correo));
        
        try {
            
            if (this.ValidacionTipoUser(data.user_reg) === false) {
                return 'Valide la informacion enviada';
            } else{
                let _qy = `UPDATE mr_bono.usuarios SET estado=:st WHERE id= :id;`;
                await this.sequelize.query(_qy, {
                    replacements: {
                        st:data.estado,
                        id: data.id_user
                    }
                });
    
                transaction.commit();
                return  `Usuario actulizado`
            }

        } catch (error) {
            console.log(error);
            
            transaction.rollback()
        }
    }




}

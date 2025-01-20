import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidatorSqlService {
  public isValidInput(input: string): boolean {
    return this.validateSQLInjection(input); // Llama a la función de validación
  }

  private validateSQLInjection(input: string): boolean {
    // Lista de patrones comunes de inyecciones SQL (puedes agregar más según lo necesites)
    const sqlInjectionPatterns = [
      /(\b(select|insert|update|delete|drop|union|exec|alter|create|truncate|grant|revoke|rename|shutdown)\b)/i, // Comandos SQL
      /(\b(or|and)\b.*\b(=|like|in)\b.*\b('|\d+)\b)/i, // Intentos de inyección con OR/AND
      /(\b(\d+|\w+)\s*(--|\#|\/\*)\s*$)/, // Comentarios de SQL
      /(;|--|\#|\/*)/, // Detecta comentarios de una sola línea
      /(\b(execute|xp_)|from|select|insert|drop|delete|update|alter)/i, // Detecta funciones o palabras clave de SQL
    ];

    // Revisa si alguno de los patrones está presente en el input
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        return false; // Si encuentra un patrón sospechoso, devuelve false
      }
    }

    return true; // Si no encuentra patrones sospechosos, es seguro
  }
}

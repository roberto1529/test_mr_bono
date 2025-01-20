import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16; // El tamaño del vector de inicialización (IV) para AES es 16 bytes

  // Método para cifrar un texto
  encrypt(text: string, secretKey: string): string {
    const iv = crypto.randomBytes(this.ivLength); // Generamos un IV aleatorio
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(secretKey, 'hex'), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Convertir tanto el IV como el texto cifrado a mayúsculas
    return `${iv.toString('hex').toUpperCase()}:${encrypted.toUpperCase()}`;
  }

  // Método para descifrar un texto cifrado
  decrypt(encryptedText: string, secretKey: string): string {
    const [ivHex, encrypted] = encryptedText.split(':'); // Obtenemos el IV y el texto cifrado
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(secretKey, 'hex'), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

export class LoginUserDto {
  @ApiProperty({ description: 'The email address of the user', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the user', example: 'password123' })
  @IsString()
  password: string;
}
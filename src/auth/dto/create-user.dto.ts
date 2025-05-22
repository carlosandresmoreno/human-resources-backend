import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class CreateUserDto {
  @ApiProperty({ description: 'The email address of the user', example: 'info@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the user (min 6 characters)', example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ description: 'The name of the user', example: 'Nombre Mario' })
  @IsString()
  name: string;
}
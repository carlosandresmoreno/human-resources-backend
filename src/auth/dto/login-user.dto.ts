import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class LoginUserDto {
  @ApiProperty({ description: 'The email address of the user', example: 'info@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password for the user', example: 'password123' })
  @IsString()
  password: string;
}
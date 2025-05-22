import { IsString, IsEmail, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class CreatePersonDto {
  @ApiProperty({ description: 'First name of the person', example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the person', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address of the person (must be unique)', example: 'jane.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Position of the person (e.g., Software Engineer)', example: 'Software Engineer', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Department of the person (e.g., Engineering)', example: 'Engineering', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Date when the person was hired (ISO 8601 format)', example: '2023-01-15T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @ApiProperty({ description: 'Salary of the person', example: 75000.00, required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;
}
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' }) 
  @ApiResponse({ status: 201, description: 'User successfully registered.', type: Object }) 
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., user already exists, validation errors).' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user and get a JWT token' })
  @ApiResponse({ status: 200, description: 'User successfully logged in, returns JWT token.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid credentials).' })
  async login(@Body() loginUserDto: LoginUserDto) { // <-- Aquí es donde se asocia el DTO con el cuerpo de la solicitud
    return this.authService.login(loginUserDto);
  }
}
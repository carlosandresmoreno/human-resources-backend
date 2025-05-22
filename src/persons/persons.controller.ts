import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'; 

@ApiTags('Persons')
@ApiBearerAuth('JWT-auth') 
@UseGuards(AuthGuard('jwt'))
@Controller('persons') 
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new person (employee)' })
  @ApiResponse({ status: 201, description: 'The person has been successfully created.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation errors).' })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve a list of all persons (employees) with pagination and optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of persons retrieved successfully.',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    description: 'Filter by department name (e.g., "Engineering")',
  })
  @ApiQuery({
    name: 'minSalary',
    required: false,
    type: Number,
    description: 'Filter by minimum salary',
  })
  @ApiQuery({
    name: 'maxSalary',
    required: false,
    type: Number,
    description: 'Filter by maximum salary',
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('department') department?: string, 
    @Query('minSalary') minSalary?: string,   
    @Query('maxSalary') maxSalary?: string,
  ) {
    const parsedMinSalary = minSalary ? parseFloat(minSalary) : undefined;
    const parsedMaxSalary = maxSalary ? parseFloat(maxSalary) : undefined;
    return this.personsService.findAll(+page, +limit, department, parsedMinSalary, parsedMaxSalary);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get details of a single person by ID' })
  @ApiResponse({ status: 200, description: 'Person details retrieved successfully.', type: Object })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing person by ID' })
  @ApiResponse({ status: 200, description: 'Person updated successfully.', type: Object })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation errors).' })
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a person by ID' })
  @ApiResponse({ status: 204, description: 'Person deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.personsService.remove(id);
  }


  @Get('stats/by-department')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get the number of persons grouped by department',
    description: 'Returns data suitable for a bar or pie chart showing department distribution.',
  })
  @ApiResponse({
    status: 200,
    description: 'Department distribution data retrieved successfully.',
    type: Array,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPersonsByDepartmentStats() {
    return this.personsService.getPersonsByDepartment();
  }

  @Get('stats/salary-distribution')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get salary distribution in ranges',
    description: 'Returns data suitable for a histogram or bar chart showing salary ranges.',
  })
  @ApiResponse({
    status: 200,
    description: 'Salary distribution data retrieved successfully.',
    type: Array,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSalaryDistributionStats() {
    return this.personsService.getSalaryDistribution();
  }

}
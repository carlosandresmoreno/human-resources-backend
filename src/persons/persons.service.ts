import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, PersonDocument } from './schemas/person.schema';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(Person.name) private personModel: Model<PersonDocument>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const newPerson = new this.personModel(createPersonDto);
    return newPerson.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    department?: string, 
    minSalary?: number,   
    maxSalary?: number,   
  ): Promise<{ data: Person[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {}; 

    if (department) {
      filter.department = department; 
    }

    if (minSalary || maxSalary) {
      filter.salary = {}; 
      if (minSalary) {
        filter.salary.$gte = minSalary; 
      }
      if (maxSalary) {
        filter.salary.$lte = maxSalary; 
      }
    }

    const total = await this.personModel.countDocuments(filter); 
    const data = await this.personModel.find(filter).skip(skip).limit(limit).exec();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Person> { 
    const person = await this.personModel.findById(id).exec();
    if (!person) {
      throw new NotFoundException(`Person with ID "${id}" not found.`);
    }
    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> { 
    const updatedPerson = await this.personModel.findByIdAndUpdate(id, updatePersonDto, { new: true }).exec();
    if (!updatedPerson) {
      throw new NotFoundException(`Person with ID "${id}" not found.`);
    }
    return updatedPerson;
  }

  async remove(id: string): Promise<any> {
    const result = await this.personModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Person with ID "${id}" not found.`);
    }
    return { message: 'Person successfully deleted.' };
  }

  async getPersonsByDepartment(): Promise<any[]> {
    return this.personModel
      .aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 }, 
          },
        },
        {
          $project: {
            _id: 0,
            department: '$_id', 
            count: 1,
          },
        },
        {
          $sort: { department: 1 }, 
        },
      ])
      .exec();
  }

  async getSalaryDistribution(): Promise<any[]> {
    return this.personModel
      .aggregate([
        {
          $match: { salary: { $exists: true, $ne: null } },
        },
        {
          $bucket: {
            groupBy: '$salary',
            boundaries: [
              0, 25000, 50000, 75000, 100000, 125000, 150000, 175000, 200000,
            ], 
            default: 'Other', 
            output: {
              count: { $sum: 1 },
              minSalary: { $min: '$salary' },
              maxSalary: { $max: '$salary' },
            },
          },
        },
        {
          $project: {
            _id: 0,
            range: {
              $concat: [
                { $toString: '$_id' },
                ' - ',
                { $toString: { $add: ['$_id', 24999] } }, 
              ],
            },
            count: 1,
            minSalary: 1,
            maxSalary: 1,
          },
        },
        {
          $sort: { _id: 1 }, 
        },
      ])
      .exec();
  }
}
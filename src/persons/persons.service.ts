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

  async findAll(page = 1, limit = 10): Promise<{ data: Person[], total: number, page: number, limit: number }> { 
    const skip = (page - 1) * limit;
    const total = await this.personModel.countDocuments();
    const data = await this.personModel.find().skip(skip).limit(limit).exec();
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
}
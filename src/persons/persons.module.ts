import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './schemas/person.schema';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use JwtModule exports

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]), 
    AuthModule, // Import AuthModule to use AuthGuard('jwt')
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
  exports: [PersonsService] // Export PersonsService if it needs to be used by other modules (e.g., dashboard stats)
})
export class PersonsModule {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonDocument = HydratedDocument<Person>;

@Schema()
export class Person {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  position: string;

  @Prop()
  department: string;

  @Prop({ type: Date })
  hireDate: Date;

  @Prop({ type: Number })
  salary: number;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
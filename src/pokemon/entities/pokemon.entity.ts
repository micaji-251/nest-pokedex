import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Document se tiene que usar para que mongoose lo reconozca
@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}
// Pokemon es una coleccion

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

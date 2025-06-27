import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    // const pokemonDB = this.findAll();
    // const duplicateTrue = await pokemonDB.find(
    //   (pokemon) => pokemon.name === createPokemonDto.name,
    // );

    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();

      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  findAll(limit = 10, offset = 0) {
    const pokemonDB = this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
    // Para quitarle la linea de __v
    return pokemonDB;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    // Name

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    }

    return pokemon;
  }

  // En update tenemos que aplicar las reglas que tenemos en post, no se puede actualizar a un pokemon con el nombre o numero que ya tiene otro, esto tiene que dar un mensaje de error
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(term: string) {
    // const idDelete: string = (await this.findOne(term)).id;
    // try {
    //   await this.pokemonModel.deleteOne({ id: idDelete });
    // } catch (error) {
    //   console.log(error);
    // }

    // const pokemon = await this.pokemonModel.findByIdAndDelete(term);

    // if (pokemon === null) {
    //   throw new BadRequestException(
    //     `Pokemon with the id :  ${term} doesn't exists in db`,
    //   );
    // }

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: term });
    if (deletedCount === 0) {
      throw new BadRequestException(
        `Pokemon with the id :  "${term}" doesn't exists in db`,
      );
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db: ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update Pokemon - Check server logs`,
    );
  }
}

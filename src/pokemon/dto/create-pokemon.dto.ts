import { IsString, IsInt, MinLength, IsPositive, Min } from 'class-validator';
export class CreatePokemonDto {
  @Min(1)
  @IsPositive()
  @IsInt()
  no: number;

  @MinLength(1)
  @IsString()
  name: string;
}

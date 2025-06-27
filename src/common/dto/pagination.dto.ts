import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit?: number;
  @IsPositive()
  @IsNumber()
  @IsOptional()
  offset?: number;
}

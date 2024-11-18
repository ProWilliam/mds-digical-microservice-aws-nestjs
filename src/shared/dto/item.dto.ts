import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Product Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the item',
    example: 'This is a detailed description of the product',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the item',
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateItemDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price?: number;
}

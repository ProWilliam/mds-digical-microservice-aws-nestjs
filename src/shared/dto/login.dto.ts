import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Your name here',
    example: 'Armando Caceres',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Your password here',
    example: '2.>SADFas23@#!',
  })
  @IsNumber()
  @Min(0)
  password: string;
}

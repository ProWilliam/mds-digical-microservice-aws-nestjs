import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AddService } from './add.service';
import { CreateItemDto } from '../shared/dto/item.dto';
import { CustomException } from '../shared/exceptions/custom-exception';

@ApiTags('Items')
@Controller('items')
export class AddController {
  private readonly logger = new Logger(AddController.name);

  constructor(private readonly addService: AddService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item created successfully',
    type: CreateItemDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async addItem(@Body(new ValidationPipe()) createItemDto: CreateItemDto) {
    try {
      this.logger.log('Adding a new item', createItemDto);
      const result = await this.addService.addItem(createItemDto);
      this.logger.log('Item added successfully', result);
      return result;
    } catch (error) {
      this.logger.error('Failed to add item', error.stack);
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}

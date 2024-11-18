import {
  Controller,
  Put,
  Param,
  Body,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateService } from './update.service';
import { UpdateItemDto } from '../shared/dto/item.dto';
import { CustomException } from '../shared/exceptions/custom-exception';

@ApiTags('Items')
@ApiBearerAuth()
@Controller('items')
export class UpdateController {
  private readonly logger = new Logger(UpdateController.name);

  constructor(private readonly updateService: UpdateService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Item ID' })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item updated successfully',
    type: UpdateItemDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async updateItem(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateItemDto: UpdateItemDto,
  ) {
    this.logger.log(`Updating item with id: ${id}`);
    try {
      const item = await this.updateService.updateItem(id, updateItemDto);
      if (!item) {
        this.logger.warn(`Item with id ${id} not found`);
        throw new NotFoundException('Item not found');
      }
      this.logger.log('Item updated successfully', item);
      return item;
    } catch (error) {
      this.logger.error('Failed to update item', error.stack);
      if (
        error instanceof CustomException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}

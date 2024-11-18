import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { RetrieveService } from './retrieve.service';
import { CustomException } from '../shared/exceptions/custom-exception';
import { CreateItemDto } from '../shared/dto/item.dto';

@ApiTags('Items')
@Controller('items')
export class RetrieveController {
  private readonly logger = new Logger(RetrieveController.name);

  constructor(private readonly retrieveService: RetrieveService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item found successfully',
    type: CreateItemDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getItem(@Param('id') id: string) {
    try {
      this.logger.debug(`Attempting to retrieve item with id: ${id}`);

      const item = await this.retrieveService.getItem(id);

      if (!item) {
        this.logger.warn(`Item not found - ID: ${id}`);
        throw new NotFoundException(`Item with ID ${id} not found`);
      }

      this.logger.debug(`Successfully retrieved item - ID: ${id}`);
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof CustomException) {
        this.logger.error(
          `Custom error occurred while retrieving item - ID: ${id}`,
          {
            error: error.message,
            stack: error.stack,
          },
        );
        throw error;
      }

      this.logger.error(
        `Unexpected error occurred while retrieving item - ID: ${id}`,
        {
          error: error.message,
          stack: error.stack,
        },
      );

      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the item',
      );
    }
  }
}

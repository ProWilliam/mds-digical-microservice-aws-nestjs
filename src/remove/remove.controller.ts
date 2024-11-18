import {
  Controller,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RemoveService } from './remove.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomException } from '../shared/exceptions/custom-exception';

@ApiTags('Items')
@ApiBearerAuth()
@Controller('items')
export class RemoveController {
  private readonly logger = new Logger(RemoveController.name);

  constructor(private readonly removeService: RemoveService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove an item by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item removed successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async removeItem(@Param('id') id: string) {
    this.logger.log(`Removing item with id: ${id}`);
    try {
      const item = await this.removeService.removeItem(id);
      if (!item) {
        this.logger.warn(`Item with id ${id} not found`);
        throw new NotFoundException('Item not found');
      }
      this.logger.log('Item removed successfully', item);
      return item;
    } catch (error) {
      this.logger.error('Failed to remove item', error.stack);
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

import { Injectable, HttpStatus } from '@nestjs/common';
import { ItemRepository } from '../shared/repositories/item.repository';
import { CustomException } from '../shared/exceptions/custom-exception';

@Injectable()
export class RetrieveService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async getItem(id: string) {
    try {
      const item = await this.itemRepository.getItem(id);
      if (!item) {
        throw new CustomException('Item not found', HttpStatus.NOT_FOUND);
      }
      return item;
    } catch (error) {
      const statusCode =
        error?.$metadata?.httpStatusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
      if (statusCode === 400) {
        throw new CustomException(
          'Bad Request: Invalid ID',
          HttpStatus.BAD_REQUEST,
        );
      } else if (statusCode === HttpStatus.NOT_FOUND) {
        throw new CustomException('Item not found', HttpStatus.NOT_FOUND);
      } else {
        throw new CustomException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

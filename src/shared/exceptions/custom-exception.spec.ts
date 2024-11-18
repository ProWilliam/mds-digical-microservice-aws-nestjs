import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

describe('CustomException', () => {
  it('should create an instance with the correct message and status', () => {
    const message = 'Custom error message';
    const status = HttpStatus.BAD_REQUEST;
    const exception = new CustomException(message, status);

    expect(exception).toBeDefined();
    expect(exception.message).toEqual(message);
    expect(exception.getStatus()).toEqual(status);
  });

  it('should create an instance with default status if not provided', () => {
    const message = 'Custom error message';
    const exception = new CustomException(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(exception).toBeDefined();
    expect(exception.message).toEqual(message);
    expect(exception.getStatus()).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

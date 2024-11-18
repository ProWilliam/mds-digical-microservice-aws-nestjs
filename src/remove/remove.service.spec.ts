import { Test, TestingModule } from '@nestjs/testing';
import { RemoveService } from './remove.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '../shared/exceptions/custom-exception';
import { HttpStatus } from '@nestjs/common';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  ...jest.requireActual('@aws-sdk/lib-dynamodb'),
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn(),
    }),
  },
}));

describe('RemoveService', () => {
  let service: RemoveService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockDynamoDb: { send: jest.Mock };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('test-table'),
    } as any;

    mockDynamoDb = {
      send: jest.fn(),
    };

    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue(mockDynamoDb);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RemoveService>(RemoveService);
  });

  describe('removeItem', () => {
    it('should remove an item successfully', async () => {
      mockDynamoDb.send.mockResolvedValueOnce({
        Attributes: { id: '1', someData: 'test' },
      });

      const result = await service.removeItem('1');

      expect(result).toEqual({ id: '1', someData: 'test' });
      expect(mockDynamoDb.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    it('should throw a CustomException if item not found', async () => {
      mockDynamoDb.send.mockResolvedValueOnce({
        Attributes: undefined,
      });

      await expect(service.removeItem('1')).rejects.toThrow(
        new CustomException('Item not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw a CustomException on DynamoDB error', async () => {
      mockDynamoDb.send.mockRejectedValueOnce(new Error('DynamoDB error'));

      await expect(service.removeItem('1')).rejects.toThrow(
        new CustomException('DynamoDB error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});

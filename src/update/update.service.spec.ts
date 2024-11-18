import { Test, TestingModule } from '@nestjs/testing';
import { UpdateService } from './update.service';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CustomException } from '../shared/exceptions/custom-exception';
import { UpdateItemDto } from '../shared/dto/item.dto';

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
    },
  };
});

describe('UpdateService', () => {
  let updateService: UpdateService;
  let dynamoDbMock: any;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateService,
        ConfigService,
        {
          provide: DynamoDBDocumentClient,
          useValue: DynamoDBDocumentClient.from(new DynamoDBClient({})),
        },
      ],
    }).compile();

    updateService = module.get<UpdateService>(UpdateService);
    dynamoDbMock = module.get<DynamoDBDocumentClient>(DynamoDBDocumentClient);
    configService = module.get<ConfigService>(ConfigService);
    configService.get = jest.fn().mockReturnValue('test-table');
  });

  it('should be defined', () => {
    expect(updateService).toBeDefined();
  });

  describe('updateItem', () => {
    it('should update an item successfully', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = { name: 'Updated Item', price: 150 };
      const updatedAttributes = {
        id,
        name: updateItemDto.name,
        price: updateItemDto.price,
      };
      const dynamoResult = { Attributes: updatedAttributes };

      dynamoDbMock.send.mockResolvedValue(dynamoResult);

      const result = await updateService.updateItem(id, updateItemDto);

      expect(result).toEqual(updatedAttributes);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw a CustomException if the item is not found', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = { name: 'Updated Item', price: 150 };

      dynamoDbMock.send.mockResolvedValue({});

      await expect(updateService.updateItem(id, updateItemDto)).rejects.toThrow(
        CustomException,
      );
      await expect(updateService.updateItem(id, updateItemDto)).rejects.toThrow(
        'Item not found',
      );
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw a CustomException if the update operation fails', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = { name: 'Updated Item', price: 150 };
      const errorMessage = 'Failed to update item';

      dynamoDbMock.send.mockRejectedValue(new Error(errorMessage));

      await expect(updateService.updateItem(id, updateItemDto)).rejects.toThrow(
        CustomException,
      );
      await expect(updateService.updateItem(id, updateItemDto)).rejects.toThrow(
        errorMessage,
      );
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });
  });
});

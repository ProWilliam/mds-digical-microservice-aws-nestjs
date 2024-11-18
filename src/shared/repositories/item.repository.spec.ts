import { Test, TestingModule } from '@nestjs/testing';
import { ItemRepository } from './item.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

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

describe('ItemRepository', () => {
  let itemRepository: ItemRepository;
  let dynamoDbMock: any;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemRepository,
        ConfigService,
        {
          provide: DynamoDBDocumentClient,
          useValue: DynamoDBDocumentClient.from(new DynamoDBClient({})),
        },
      ],
    }).compile();

    itemRepository = module.get<ItemRepository>(ItemRepository);
    dynamoDbMock = module.get<DynamoDBDocumentClient>(DynamoDBDocumentClient);
    configService = module.get<ConfigService>(ConfigService);
    configService.get = jest.fn().mockReturnValue('test-table');
  });

  it('should be defined', () => {
    expect(itemRepository).toBeDefined();
  });

  describe('getItem', () => {
    it('should retrieve an item successfully', async () => {
      const id = '1';
      const item = {
        id,
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };
      dynamoDbMock.send.mockResolvedValue({ Item: item });

      const result = await itemRepository.getItem(id);

      expect(result).toEqual(item);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should return null if the item is not found', async () => {
      const id = '1';
      dynamoDbMock.send.mockResolvedValue({});

      const result = await itemRepository.getItem(id);

      expect(result).toBeNull();
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should throw an error if the get operation fails', async () => {
      const id = '1';
      const errorMessage = 'Failed to get item';
      dynamoDbMock.send.mockRejectedValue(new Error(errorMessage));

      await expect(itemRepository.getItem(id)).rejects.toThrow(errorMessage);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('addItem', () => {
    it('should add an item successfully', async () => {
      const item = {
        id: '1',
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };
      dynamoDbMock.send.mockResolvedValue({});

      const result = await itemRepository.addItem(item);

      expect(result).toEqual(item);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw an error if the put operation fails', async () => {
      const item = {
        id: '1',
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };
      const errorMessage = 'Failed to add item';
      dynamoDbMock.send.mockRejectedValue(new Error(errorMessage));

      await expect(itemRepository.addItem(item)).rejects.toThrow(errorMessage);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });

  describe('updateItem', () => {
    it('should update an item successfully', async () => {
      const id = '1';
      const updateData = { name: 'Updated Item', price: 150 };
      const updatedAttributes = {
        id,
        name: updateData.name,
        price: updateData.price,
      };
      dynamoDbMock.send.mockResolvedValue({ Attributes: updatedAttributes });

      const result = await itemRepository.updateItem(id, updateData);

      expect(result).toEqual(updatedAttributes);
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should return null if the item is not found', async () => {
      const id = '1';
      const updateData = { name: 'Updated Item', price: 150 };
      dynamoDbMock.send.mockResolvedValue({});

      const result = await itemRepository.updateItem(id, updateData);

      expect(result).toBeNull();
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw an error if the update operation fails', async () => {
      const id = '1';
      const updateData = { name: 'Updated Item', price: 150 };
      const errorMessage = 'Failed to update item';
      dynamoDbMock.send.mockRejectedValue(new Error(errorMessage));

      await expect(itemRepository.updateItem(id, updateData)).rejects.toThrow(
        errorMessage,
      );
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });
  });
});

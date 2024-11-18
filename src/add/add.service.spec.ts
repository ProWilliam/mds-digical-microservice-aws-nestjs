import { Test, TestingModule } from '@nestjs/testing';
import { AddService } from './add.service';
import { CreateItemDto } from '../shared/dto/item.dto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CustomException } from '../shared/exceptions/custom-exception';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
    },
    PutCommand: jest.fn(),
  };
});

describe('AddService', () => {
  let service: AddService;
  let configService: ConfigService;
  let dynamoDbMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AddService,
        ConfigService,
        {
          provide: DynamoDBDocumentClient,
          useValue: DynamoDBDocumentClient.from(new DynamoDBClient({})),
        },
      ],
    }).compile();

    service = module.get<AddService>(AddService);
    configService = module.get<ConfigService>(ConfigService);
    dynamoDbMock = module.get<DynamoDBDocumentClient>(DynamoDBDocumentClient);
    configService.get = jest.fn().mockReturnValue('table_mdsdigital');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItem', () => {
    it('should add a new item and return the result', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      const uuid = 'test-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(uuid);

      jest.spyOn(dynamoDbMock, 'send').mockResolvedValue({});

      const result = await service.addItem(createItemDto);
      expect(result).toEqual({ id: uuid, ...createItemDto });
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw an error if DynamoDB put fails', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      jest
        .spyOn(dynamoDbMock, 'send')
        .mockRejectedValue(new Error('DynamoDB error'));

      await expect(service.addItem(createItemDto)).rejects.toThrow(
        CustomException,
      );
      expect(dynamoDbMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });
});

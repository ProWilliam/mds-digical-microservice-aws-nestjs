import { DynamoDBUtils } from './dynamoDB.utils';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  ListTablesCommand: jest.fn().mockImplementation((params) => ({
    ...params,
    input: params,
    middlewareStack: {
      clone: jest.fn(),
      add: jest.fn(),
      addRelativeTo: jest.fn(),
      remove: jest.fn(),
      use: jest.fn(),
      resolve: jest.fn(),
    },
  })),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const mockDynamoDBDocumentClient = {
    from: jest.fn().mockReturnValue({
      send: jest.fn(),
    }),
  };
  return {
    DynamoDBDocumentClient: mockDynamoDBDocumentClient,
  };
});

describe('DynamoDBUtils', () => {
  let dynamoDBUtils: DynamoDBUtils;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'AWS_REGION':
            return 'us-west-2';
          case 'AWS_ACCESS_KEY_ID':
            return 'mockAccessKeyId';
          case 'AWS_SECRET_ACCESS_KEY':
            return 'mockSecretAccessKey';
          default:
            return null;
        }
      }),
    };

    dynamoDBUtils = new DynamoDBUtils(mockConfigService as ConfigService);
  });

  it('should create a DynamoDB DocumentClient with the correct configuration', () => {
    const client = dynamoDBUtils.getDynamoDbClient();

    expect(client).toBeDefined();

    // Verify that the ConfigService get methods were called with the correct keys
    expect(mockConfigService.get).toHaveBeenCalledWith('AWS_REGION');
    expect(mockConfigService.get).toHaveBeenCalledWith('AWS_ACCESS_KEY_ID');
    expect(mockConfigService.get).toHaveBeenCalledWith('AWS_SECRET_ACCESS_KEY');

    // Mock the DynamoDBClient constructor to check for correct parameters
    const mockDynamoDBClient = jest.mocked(DynamoDBClient);
    expect(mockDynamoDBClient).toHaveBeenCalledWith({
      region: 'us-west-2',
      credentials: {
        accessKeyId: 'mockAccessKeyId',
        secretAccessKey: 'mockSecretAccessKey',
      },
    });
  });

  it('should be able to list tables', async () => {
    // Create a mock client first
    const mockSend = jest.fn().mockResolvedValue({
      TableNames: ['test-table'],
      $metadata: {},
    });

    const mockDocClient = {
      send: mockSend,
    };

    // Mock the DynamoDBDocumentClient.from to return our mock client
    jest
      .spyOn(DynamoDBDocumentClient, 'from')
      .mockReturnValue(mockDocClient as any);

    // Get the client and make the call
    const client = dynamoDBUtils.getDynamoDbClient();
    const command = new ListTablesCommand({});
    const result = await client.send(command);

    // Verify the results
    expect(result.TableNames).toContain('test-table');
    expect(mockSend).toHaveBeenCalledWith(command);
  });
});

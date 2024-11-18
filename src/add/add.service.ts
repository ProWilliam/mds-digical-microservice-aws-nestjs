import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CreateItemDto } from '../shared/dto/item.dto';
import { CustomException } from '../shared/exceptions/custom-exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AddService {
  private readonly dynamoDb: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private configService: ConfigService) {
    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE');
  }

  async addItem(createItemDto: CreateItemDto) {
    const id = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: { ...createItemDto, id },
    };

    try {
      await this.dynamoDb.send(new PutCommand(params));
      return { id, ...createItemDto };
    } catch {
      throw new CustomException(
        'Failed to add item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

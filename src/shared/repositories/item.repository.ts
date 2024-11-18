import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ItemRepository {
  private readonly dynamoDb: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private configService: ConfigService) {
    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE');
  }

  async getItem(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    const result = await this.dynamoDb.send(new GetCommand(params));
    return result.Item || null;
  }

  async addItem(item: any) {
    const params = {
      TableName: this.tableName,
      Item: item,
    };
    await this.dynamoDb.send(new PutCommand(params));
    return item;
  }

  async updateItem(id: string, updateData: any) {
    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'set #name = :name, price = :price',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': updateData.name,
        ':price': updateData.price,
      },
      ReturnValues: 'ALL_NEW' as const,
    };
    const result = await this.dynamoDb.send(new UpdateCommand(params));
    return result.Attributes || null;
  }
}

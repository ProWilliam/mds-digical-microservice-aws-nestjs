import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '../shared/exceptions/custom-exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class RemoveService {
  private readonly dynamoDb: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private configService: ConfigService) {
    const client = new DynamoDBClient({});
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE');
  }

  async removeItem(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id },
      ReturnValues: 'ALL_OLD' as const,
    };

    try {
      const result = await this.dynamoDb.send(new DeleteCommand(params));

      if (!result.Attributes) {
        throw new CustomException('Item not found', HttpStatus.NOT_FOUND);
      }

      return result.Attributes;
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

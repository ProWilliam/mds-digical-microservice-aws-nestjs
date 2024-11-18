# MDSDigital-Microservice

## Description
MDSDigital-Microservice is a NestJS project designed to run serverless on AWS Lambda with API Gateway and DynamoDB. This project includes five microservices: Retrieve, Add, Update and Remove items, auth in the database. The application follows SOLID principles, includes validation, and unit tests to ensure quality and maintainability.



## Table of Contents
1. [Project Structure](#project-structure)
2. [Setup Instructions](#setup-instructions)
3. [Running the Application](#running-the-application)
4. [Deployment](#deployment)
5. [AWS Lambda Configure](#aws-lambda-configuration)
5. [Best Practices](#best-practices)
6. [Testing](#testing)



## Project Structure
  ```
  mds-digital-microservice/ 
  |-- .github/
  | |-- workflows/
  |   |-- deploy.yml 
  |-- src/ 
  | |-- add/ 
  | │ ├── add.controller.spec.ts 
  | │ ├── add.controller.ts 
  | │ ├── add.module.ts 
  | │ ├── add.service.spec.ts 
  | │ └── add.sercive.ts 
  | |-- auth/ 
  | │ ├── auth.controller.spec.ts 
  | │ ├── auth.controller.ts 
  | │ ├── auth.module.ts 
  | │ ├── auth.service.spec.ts 
  | │ ├── auth.service.ts 
  | │ ├── jwt-auth.guard.spec.ts 
  | │ ├── jwt-auth.guard.ts 
  | │ ├── jwt.strategy.spec.ts 
  | │ └── jwt.strategy.ts
  | |-- remove/ 
  | │ ├── remove.controller.spec.ts 
  | │ ├── remove.controller.ts 
  | │ ├── remove.module.ts 
  | │ ├── remove.service.spec.ts 
  | │ └── remove.sercive.ts
  | |-- retrieve/ 
  | │ ├── retrieve.controller.spec.ts 
  | │ ├── retrieve.controller.ts 
  | │ ├── retrieve.module.ts 
  | │ ├── retrieve.service.spec.ts 
  | │ └── retrieve.service.ts 
  | |-- shared/ 
  | │ |-- dto/ 
  | | │ ├── item.dto.ts
  | │ │ └── login.dto.ts 
  | │ |-- exceptions/ 
  | | │ ├── custom-exception.spec.ts
  | │ │ └── custom-exception.ts 
  | │ |-- repositories/ 
  | | | ├── item.repository.spec.ts
  | │ | └── item.repository.ts 
  | | |-- utils/ 
  | | | ├── dynamoDB.utils.spec.ts
  | │ | └── dynamoDB.utils.ts 
  | | |-- shared.module.ts
  | |-- update/ 
  | │ ├── update.controller.spec.ts 
  | │ ├── update.controller.ts 
  | │ ├── update.module.ts 
  | │ ├── update.service.spec.ts 
  | │ └── update.service.ts 
  | ├── app.module.ts 
  | ├── lambda.ts 
  | └── main.ts 
  |-- test/ 
  |-- .env.example
  |-- .eslintrc.js 
  |-- .gitignore
  |-- .prettierrc
  |-- jest.config.js 
  |-- nest-cli.json 
  |-- package-lock.json
  |-- package.json
  |-- README.md
  |-- serverless.yml 
  |-- tsconfig.build.json
  |-- tsconfig.json
  ```



## Setup Instructions
### Prerequisites
- Node.js v14.x or newer
- npm or yarn
- AWS CLI configured with appropriate permissions
- Serverless Framework installed globally
```bash
npm install -g serverless
```



## Installation
1. Clone the repository:
```bash
git clone https://github.com/your-repo/MDSDigital-Microservice.git
cd MDSDigital-Microservice
```

2. Install dependencies:
```bash
npm install
```



## Environment Configuration
Create a .env file in the root of the project and add the following variables:
```
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
AWS_ACCOUNT_ID=your_acound_ID

# DynamoDB Configuration
DYNAMODB_TABLE=your_dynamodb_table_name

# Other settings
NODE_ENV=development
PORT=3000

# JWT Secret
JWT_SECRET=TacosAlPastor
EXPIRE_IN=1d
```



## CI/CD Pipeline

This project leverages **Continuous Integration (CI) and Continuous Deployment (CD)** using **GitHub Actions** and the **Serverless Framework** to ensure efficient and reliable deployment processes.

### Continuous Integration (CI)
Every code change pushed to the `main` branch or submitted via a pull request triggers automated workflows in GitHub Actions. These workflows perform:

- Linting and formatting checks.
- Unit and integration tests using Jest.
- Build verification.

### Continuous Deployment (CD)
Upon successful completion of the CI processes, the project is automatically deployed to **AWS Lambda** using **Serverless Framework**. The deployment process includes:

- Packaging the project and dependencies.
- Updating API Gateway and DynamoDB configurations as required.
- Leveraging environment variables for secure and dynamic configuration.

This setup ensures fast feedback on code changes, consistent deployments, and scalable infrastructure management.

## Running the Application

### Development
1. Start the application in development mode:
```bash
npm run start:dev
```

2. The application will be available at http://localhost:3000 or http://127.0.0.1:3000


### Production
1. Build the application:
```bash
npm run build
```

2. Start the application:
```bash
npm run start:prod
```

## Deployment

### Deploy to AWS

1. Ensure you have configured AWS CLI with appropriate permissions.
2. Deploy the application using Serverless Framework:
```bash
serverless deploy --verbose
```

3. Monitor the deployment logs and ensure there are no errors.



## AWS Lambda Configuration
- Retrieve Service:
  - Method: GET /items/{id}
  - Description: This service receives an ID and returns the details of an item stored in the database.
  - Response: HTTP 200 if the item exists, HTTP 404 if not found.

- Add Service:
  - Method: POST /items
  - Description: This service allows adding a new item to the database.
  - Input: JSON body with the new item’s data.
  - Response: HTTP 201 if the operation is successful.

- Update Service:
  - Method: PUT /items/{id}
  - Description: This service allows updating an existing item.
  - Input: ID in URL and a JSON body with the fields to be updated.
  - Response: HTTP 200 if the update is successful, HTTP 404 i the item does not exist.

- remove Service:
  - Method: DELETE /items/{id}
  - Description: This service allows remove an existing item.
  - Input: ID in URL and a JSON body with the fields to be updated.
  - Response: HTTP 200 if the update is successful, HTTP 404 i the item does not exist.

- Add Service:
  - Method: POST /auth/login
  - Description: This service authentic a new user to the database.
  - Input: JSON body with the new item’s data.
  - Response: HTTP 201 with a JSON access_token message body that has a token.

## Best Practices
1. SOLID Principles: Ensure code follows SOLID principles for maintainability and scalability.
2. Validation: Use class-validator to validate DTOs.
3. Logging: Utilize NestJS Logger for debugging and monitoring.
4. Exception Handling: Implement custom exceptions to handle errors gracefully.
5. Repository Pattern: Use repositories to interact with the database, ensuring a clean separation of concerns.



## Testing

### Unit Tests
1. Run unit tests:
```bash
npm run test
```

2. Watch mode:
```bash
npm run test:watch
```

3. Coverage:
```bash 
npm run test:cov
```

### Example Test for AddController
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AddController } from './add.controller';
import { AddService } from './add.service';
import { CreateItemDto } from '../shared/dto/item.dto';
import { ValidationPipe } from '@nestjs/common';
import { CustomException } from '../shared/exceptions/custom-exception';

describe('AddController', () => {
  let addController: AddController;
  let addService: AddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddController],
      providers: [
        {
          provide: AddService,
          useValue: {
            addItem: jest.fn(),
          },
        },
      ],
    }).compile();

    addController = module.get<AddController>(AddController);
    addService = module.get<AddService>(AddService);
  });

  it('should be defined', () => {
    expect(addController).toBeDefined();
  });

  describe('addItem', () => {
    it('should add a new item and return the result', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      const result = { id: '1', ...createItemDto };
      jest.spyOn(addService, 'addItem').mockResolvedValue(result);

      const response = await addController.addItem(createItemDto);

      expect(response).toEqual(result);
      expect(addService.addItem).toHaveBeenCalledWith(createItemDto);
    });

    it('should throw an error if the service throws an error', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      jest.spyOn(addService, 'addItem').mockRejectedValue(new CustomException('Failed to add item', 500));

      await expect(addController.addItem(createItemDto)).rejects.toThrow(CustomException);
    });
  });
});

```
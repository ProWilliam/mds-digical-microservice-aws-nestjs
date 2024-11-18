import { Test, TestingModule } from '@nestjs/testing';
import { AddController } from './add.controller';
import { AddService } from './add.service';
import { CreateItemDto } from '../shared/dto/item.dto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomException } from '../shared/exceptions/custom-exception';

describe('AddController', () => {
  let addController: AddController;
  let addService: AddService;
  let loggerErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Silence Logger.error during all tests.
    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore the original method.
    loggerErrorSpy.mockRestore();
  });

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

    it('should throw a CustomException if the service throws a CustomException', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      jest
        .spyOn(addService, 'addItem')
        .mockRejectedValue(new CustomException('Failed to add item', 500));

      await expect(addController.addItem(createItemDto)).rejects.toThrow(
        CustomException,
      );
      expect(addService.addItem).toHaveBeenCalledWith(createItemDto);
    });

    it('should throw an InternalServerErrorException if the service throws a generic error', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };

      jest
        .spyOn(addService, 'addItem')
        .mockRejectedValue(new Error('Generic error'));

      await expect(addController.addItem(createItemDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(addService.addItem).toHaveBeenCalledWith(createItemDto);
    });
  });
});

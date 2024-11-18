import { Test, TestingModule } from '@nestjs/testing';
import { UpdateController } from './update.controller';
import { UpdateService } from './update.service';
import { UpdateItemDto } from '../shared/dto/item.dto';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CustomException } from '../shared/exceptions/custom-exception';

describe('UpdateController', () => {
  let updateController: UpdateController;
  let updateService: UpdateService;
  let loggerErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
  });

  afterAll(() => {
    loggerErrorSpy.mockRestore();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateController],
      providers: [
        {
          provide: UpdateService,
          useValue: {
            updateItem: jest.fn(),
          },
        },
      ],
    }).compile();

    updateController = module.get<UpdateController>(UpdateController);
    updateService = module.get<UpdateService>(UpdateService);
  });

  it('should be defined', () => {
    expect(updateController).toBeDefined();
  });

  describe('updateItem', () => {
    it('should update an item successfully', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
        description: 'Updated Description',
        price: 150,
      };
      const updatedItem = { id, ...updateItemDto };
      jest.spyOn(updateService, 'updateItem').mockResolvedValue(updatedItem);

      const result = await updateController.updateItem(id, updateItemDto);

      expect(result).toEqual(updatedItem);
      expect(updateService.updateItem).toHaveBeenCalledWith(id, updateItemDto);
    });

    it('should throw a NotFoundException if the item is not found', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
        description: 'Updated Description',
        price: 150,
      };
      jest.spyOn(updateService, 'updateItem').mockResolvedValue(null);

      await expect(
        updateController.updateItem(id, updateItemDto),
      ).rejects.toThrow(NotFoundException);
      expect(updateService.updateItem).toHaveBeenCalledWith(id, updateItemDto);
    });

    it('should throw a CustomException if the service throws a CustomException', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
        description: 'Updated Description',
        price: 150,
      };
      jest
        .spyOn(updateService, 'updateItem')
        .mockRejectedValue(new CustomException('Custom error', 500));

      await expect(
        updateController.updateItem(id, updateItemDto),
      ).rejects.toThrow(CustomException);
      expect(updateService.updateItem).toHaveBeenCalledWith(id, updateItemDto);
    });

    it('should throw an InternalServerErrorException if the service throws a generic error', async () => {
      const id = '1';
      const updateItemDto: UpdateItemDto = {
        name: 'Updated Item',
        description: 'Updated Description',
        price: 150,
      };
      jest
        .spyOn(updateService, 'updateItem')
        .mockRejectedValue(new Error('Generic error'));

      await expect(
        updateController.updateItem(id, updateItemDto),
      ).rejects.toThrow(InternalServerErrorException);
      expect(updateService.updateItem).toHaveBeenCalledWith(id, updateItemDto);
    });
  });
});

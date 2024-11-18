import { Test, TestingModule } from '@nestjs/testing';
import { RetrieveController } from './retrieve.controller';
import { RetrieveService } from './retrieve.service';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CustomException } from '../shared/exceptions/custom-exception';

describe('RetrieveController', () => {
  let retrieveController: RetrieveController;
  let retrieveService: RetrieveService;
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
      controllers: [RetrieveController],
      providers: [
        {
          provide: RetrieveService,
          useValue: {
            getItem: jest.fn(),
          },
        },
      ],
    }).compile();

    retrieveController = module.get<RetrieveController>(RetrieveController);
    retrieveService = module.get<RetrieveService>(RetrieveService);
  });

  it('should be defined', () => {
    expect(retrieveController).toBeDefined();
  });

  describe('getItem', () => {
    it('should retrieve an item successfully', async () => {
      const id = '1';
      const item = { id, name: 'Test Item' };
      jest.spyOn(retrieveService, 'getItem').mockResolvedValue(item);

      const result = await retrieveController.getItem(id);

      expect(result).toEqual(item);
      expect(retrieveService.getItem).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if the item is not found', async () => {
      const id = '1';
      jest.spyOn(retrieveService, 'getItem').mockResolvedValue(null);

      await expect(retrieveController.getItem(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(retrieveService.getItem).toHaveBeenCalledWith(id);
    });

    it('should throw a CustomException if the service throws a CustomException', async () => {
      const id = '1';
      jest
        .spyOn(retrieveService, 'getItem')
        .mockRejectedValue(new CustomException('Custom error', 500));

      await expect(retrieveController.getItem(id)).rejects.toThrow(
        CustomException,
      );
      expect(retrieveService.getItem).toHaveBeenCalledWith(id);
    });

    it('should throw an InternalServerErrorException if the service throws a generic error', async () => {
      const id = '1';
      jest
        .spyOn(retrieveService, 'getItem')
        .mockRejectedValue(new Error('Generic error'));

      await expect(retrieveController.getItem(id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(retrieveService.getItem).toHaveBeenCalledWith(id);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RemoveController } from './remove.controller';
import { RemoveService } from './remove.service';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

describe('RemoveController', () => {
  let controller: RemoveController;
  let service: RemoveService;
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
      controllers: [RemoveController],
      providers: [
        {
          provide: RemoveService,
          useValue: {
            removeItem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RemoveController>(RemoveController);
    service = module.get<RemoveService>(RemoveService);
  });

  describe('deleteItem', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should remove an item successfully', async () => {
      const result = { id: '1', name: 'Test Item' };

      jest.spyOn(service, 'removeItem').mockResolvedValue(result);
      expect(await controller.removeItem('1')).toBe(result);
    });

    it('should throw NotFoundException if item not found', async () => {
      jest
        .spyOn(service, 'removeItem')
        .mockRejectedValue(new NotFoundException('Item not found'));
      await expect(controller.removeItem('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on internal error', async () => {
      jest
        .spyOn(service, 'removeItem')
        .mockRejectedValue(
          new InternalServerErrorException('Internal server error'),
        );
      await expect(controller.removeItem('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

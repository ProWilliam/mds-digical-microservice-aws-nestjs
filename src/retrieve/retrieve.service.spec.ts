import { Test, TestingModule } from '@nestjs/testing';
import { RetrieveService } from './retrieve.service';
import { ItemRepository } from '../shared/repositories/item.repository';
import { CustomException } from '../shared/exceptions/custom-exception';

describe('RetrieveService', () => {
  let retrieveService: RetrieveService;
  let itemRepository: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetrieveService,
        {
          provide: ItemRepository,
          useValue: {
            getItem: jest.fn(),
          },
        },
      ],
    }).compile();

    retrieveService = module.get<RetrieveService>(RetrieveService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  it('should be defined', () => {
    expect(retrieveService).toBeDefined();
  });

  describe('getItem', () => {
    it('should retrieve an item successfully', async () => {
      const id = '1';
      const item = {
        id,
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
      };
      jest.spyOn(itemRepository, 'getItem').mockResolvedValue(item);

      const result = await retrieveService.getItem(id);

      expect(result).toEqual(item);
      expect(itemRepository.getItem).toHaveBeenCalledWith(id);
    });

    it('should throw a CustomException if the item is not found', async () => {
      const id = '1';
      jest.spyOn(itemRepository, 'getItem').mockResolvedValue(null);

      await expect(retrieveService.getItem(id)).rejects.toThrow(
        CustomException,
      );
      await expect(retrieveService.getItem(id)).rejects.toThrow(
        'Item not found',
      );
      expect(itemRepository.getItem).toHaveBeenCalledWith(id);
    });

    it('should throw a CustomException if the repository throws an error', async () => {
      const id = '1';
      jest
        .spyOn(itemRepository, 'getItem')
        .mockRejectedValue(new Error('Repository error'));

      await expect(retrieveService.getItem(id)).rejects.toThrow(
        CustomException,
      );
      await expect(retrieveService.getItem(id)).rejects.toThrow(
        'Repository error',
      );
      expect(itemRepository.getItem).toHaveBeenCalledWith(id);
    });
  });
});

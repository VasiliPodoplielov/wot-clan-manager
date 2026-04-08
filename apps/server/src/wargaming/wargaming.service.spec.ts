import { Test, TestingModule } from '@nestjs/testing';
import { WargamingService } from './wargaming.service';

describe('WargamingService', () => {
  let service: WargamingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WargamingService],
    }).compile();

    service = module.get<WargamingService>(WargamingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

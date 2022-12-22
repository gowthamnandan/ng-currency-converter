import { TestBed } from '@angular/core/testing';

import { CurrencyModelService } from './currency-model.service';

describe('CurrencyModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrencyModelService = TestBed.get(CurrencyModelService);
    expect(service).toBeTruthy();
  });
});

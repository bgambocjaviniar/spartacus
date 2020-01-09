import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import createSpy = jasmine.createSpy;

import { BudgetAdapter } from './budget.adapter';
import { BudgetConnector } from './budget.connector';
import { BudgetSearchConfig } from '../../model/search-config';

const userId = 'userId';
const budgetCode = 'budgetCode';

const budget = {
  code: budgetCode,
};

class MockBudgetAdapter implements BudgetAdapter {
  load = createSpy('BudgetAdapter.load').and.returnValue(of(budget));
  loadList = createSpy('BudgetAdapter.loadList').and.returnValue(of([budget]));
  create = createSpy('BudgetAdapter.create').and.returnValue(of(budget));
  update = createSpy('BudgetAdapter.update').and.returnValue(of(budget));
}

describe('BudgetConnector', () => {
  let service: BudgetConnector;
  let adapter: BudgetAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BudgetConnector,
        { provide: BudgetAdapter, useClass: MockBudgetAdapter },
      ],
    });

    service = TestBed.get(BudgetConnector as Type<BudgetConnector>);
    adapter = TestBed.get(BudgetAdapter as Type<BudgetAdapter>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load budget', () => {
    service.get(userId, budgetCode);
    expect(adapter.load).toHaveBeenCalledWith(userId, budgetCode);
  });

  it('should load budgets', () => {
    const params: BudgetSearchConfig = { sort: 'code' };
    service.getList(userId, params);
    expect(adapter.loadList).toHaveBeenCalledWith(userId, params);
  });

  it('should create budget', () => {
    service.create(userId, budget);
    expect(adapter.create).toHaveBeenCalledWith(userId, budget);
  });

  it('should update budget', () => {
    service.update(userId, budgetCode, budget);
    expect(adapter.update).toHaveBeenCalledWith(userId, budgetCode, budget);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { User } from '../../../model/misc.model';
import { UserAdapter } from '../../connectors/user/user.adapter';
import { UserConnector } from '../../connectors/user/user.connector';
import { UserActions } from '../actions/index';
import * as fromUserDetailsEffect from './user-details.effect';

const mockUserDetails: User = {
  displayUid: 'Display Uid',
  firstName: 'First',
  lastName: 'Last',
  uid: 'UID',
};

describe('User Details effect', () => {
  let userDetailsEffect: fromUserDetailsEffect.UserDetailsEffects;
  let userService: UserConnector;
  let actions$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        fromUserDetailsEffect.UserDetailsEffects,
        { provide: UserAdapter, useValue: {} },
        provideMockActions(() => actions$),
      ],
    });

    userDetailsEffect = TestBed.inject(
      fromUserDetailsEffect.UserDetailsEffects
    );
    userService = TestBed.inject(UserConnector);
  });

  describe('loadUserDetails$', () => {
    it('should load user details', () => {
      spyOn(userService, 'get').and.returnValue(of(mockUserDetails));

      const action = new UserActions.LoadUserDetails('mockName');
      const completion = new UserActions.LoadUserDetailsSuccess(
        mockUserDetails
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(userDetailsEffect.loadUserDetails$).toBeObservable(expected);
    });
  });
});

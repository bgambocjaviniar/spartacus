import { User } from '../../../model/misc.model';
import { UserActions } from '../actions/index';
import * as fromUserDetailsReducer from './user-details.reducer';

const mockUserDetails: User = {
  displayUid: 'Display Uid',
  firstName: 'First',
  lastName: 'Last',
  name: 'First Last',
  uid: 'UID',
};

describe('User Details Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUserDetailsReducer;
      const action = {} as UserActions.UserDetailsAction;
      const state = fromUserDetailsReducer.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_USER_DETAILS_SUCCESS action', () => {
    it('should populate the user details state entities', () => {
      const { initialState } = fromUserDetailsReducer;
      const action = new UserActions.LoadUserDetailsSuccess(mockUserDetails);
      const state = fromUserDetailsReducer.reducer(initialState, action);

      expect(state).toEqual(mockUserDetails);
    });
  });
});

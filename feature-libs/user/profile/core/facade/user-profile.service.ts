import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ProcessSelectors,
  StateUtils,
  StateWithProcess,
} from '@spartacus/core';
import { User, UserAccountFacade } from '@spartacus/user/account/root';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Title, UserProfileFacade } from '@spartacus/user/profile/root';
import { UserProfileActions, UserProfileSelectors } from '../store/index';
import {
  CLOSE_USER_PROCESS_ID,
  StateWithUserProfile,
  UPDATE_USER_PROFILE_PROCESS_ID,
} from '../store/user-profile.state';

@Injectable()
export class UserProfileService implements UserProfileFacade {
  constructor(
    protected store: Store<StateWithUserProfile | StateWithProcess<User>>,
    protected userAccountService: UserAccountFacade
  ) {}

  get(): Observable<User> {
    return this.userAccountService.get();
  }

  /**
   * Updates the user's details.
   *
   * @param details User details to be updated.
   */
  update(details: User): Observable<StateUtils.LoaderState<User>> {
    this.get()
      .pipe(
        take(1),
        tap((user) =>
          this.store.dispatch(
            new UserProfileActions.UpdateUserProfile({
              // tslint:disable-next-line:no-non-null-assertion
              uid: user.uid!,
              details,
            })
          )
        )
      )
      .subscribe();

    return this.process(UPDATE_USER_PROFILE_PROCESS_ID);
  }

  /**
   * Closes the user account.
   */
  close(): Observable<StateUtils.LoaderState<User>> {
    return this.get().pipe(
      tap((user) =>
        // tslint:disable-next-line:no-non-null-assertion
        this.store.dispatch(new UserProfileActions.RemoveUser(user.uid!))
      ),
      switchMap(() => this.process(CLOSE_USER_PROCESS_ID))
    );
  }

  /**
   * Returns titles that can be used for the user profiles.
   */
  getTitles(): Observable<Title[]> {
    return (this.store as Store<StateWithUserProfile>).pipe(
      select(UserProfileSelectors.getAllTitles),
      tap((titles: Title[]) => {
        if (Object.keys(titles).length === 0) {
          this.loadTitles();
        }
      })
    );
  }

  /**
   * Retrieves titles.
   */
  protected loadTitles(): void {
    this.store.dispatch(new UserProfileActions.LoadTitles());
  }

  private process(processId: string): Observable<StateUtils.LoaderState<User>> {
    return (this.store as Store<StateWithProcess<User>>).pipe(
      select(ProcessSelectors.getProcessStateFactory(processId))
    );
  }
}

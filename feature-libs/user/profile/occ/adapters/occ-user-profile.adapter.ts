import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ConverterService,
  InterceptorUtil,
  Occ,
  OccEndpointsService,
  USE_CLIENT_TOKEN,
} from '@spartacus/core';
import { User } from '@spartacus/user/account/root';
import {
  TITLE_NORMALIZER,
  USER_PROFILE_NORMALIZER,
  USER_PROFILE_SERIALIZER,
  USER_SIGN_UP_SERIALIZER,
  UserProfileAdapter,
} from '@spartacus/user/profile/core';
import { Title, UserSignUp } from '@spartacus/user/profile/root';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OccUserProfileAdapter implements UserProfileAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  update(userId: string, user: User): Observable<{}> {
    const url = this.occEndpoints.getUrl('user', { userId });
    user = this.converter.convert(user, USER_PROFILE_SERIALIZER);
    return this.http.patch(url, user);
  }

  register(user: UserSignUp): Observable<User> {
    const url: string = this.occEndpoints.getUrl('userRegister');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    user = this.converter.convert(user, USER_SIGN_UP_SERIALIZER);

    return this.http
      .post<User>(url, user, { headers })
      .pipe(this.converter.pipeable(USER_PROFILE_NORMALIZER));
  }

  registerGuest(guid: string, password: string): Observable<User> {
    const url: string = this.occEndpoints.getUrl('userRegister');
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const httpParams: HttpParams = new HttpParams()
      .set('guid', guid)
      .set('password', password);

    return this.http
      .post<User>(url, httpParams, { headers })
      .pipe(this.converter.pipeable(USER_PROFILE_NORMALIZER));
  }

  requestForgotPasswordEmail(userEmailAddress: string): Observable<{}> {
    const url = this.occEndpoints.getUrl('userForgotPassword');
    const httpParams: HttpParams = new HttpParams().set(
      'userId',
      userEmailAddress
    );
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http.post(url, httpParams, { headers });
  }

  resetPassword(token: string, newPassword: string): Observable<{}> {
    const url = this.occEndpoints.getUrl('userResetPassword');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    return this.http.post(url, { token, newPassword }, { headers });
  }

  updateEmail(
    userId: string,
    currentPassword: string,
    newUserId: string
  ): Observable<{}> {
    const url = this.occEndpoints.getUrl('userUpdateLoginId', { userId });
    const httpParams: HttpParams = new HttpParams()
      .set('password', currentPassword)
      .set('newLogin', newUserId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.put(url, httpParams, { headers });
  }

  updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Observable<{}> {
    const url = this.occEndpoints.getUrl('userUpdatePassword', { userId });
    const httpParams: HttpParams = new HttpParams()
      .set('old', oldPassword)
      .set('new', newPassword);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.put(url, httpParams, { headers });
  }

  close(userId: string): Observable<{}> {
    const url = this.occEndpoints.getUrl('user', { userId });
    return this.http.delete<User>(url);
  }

  loadTitles(): Observable<Title[]> {
    const url = this.occEndpoints.getUrl('titles');
    return this.http.get<Occ.TitleList>(url).pipe(
      map((titleList) => titleList.titles ?? []),
      this.converter.pipeableMany(TITLE_NORMALIZER)
    );
  }
}

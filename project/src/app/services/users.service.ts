import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from '@appRoot/types/user.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Session } from '@appRoot/types/session.interface';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService implements OnDestroy {
  httpClient = inject(HttpClient);
  router = inject(Router);
  usersUrl = `${environment.baseUrl}/users`;
  private _unsubscribe$ = new Subject<void>();
  private _userSession = new BehaviorSubject<Session | null>(null);
  public userSession$ = this._userSession as Observable<Session>;

  get session() {
    return this._userSession.value;
  }

  findUserByUsername(username: string): Observable<User | undefined> {
    return this.getAllUsers().pipe(
      map((users) =>
        users.find(
          (user) => user.userName.toLowerCase() === username.toLowerCase(),
        ),
      ),
      takeUntil(this._unsubscribe$),
    );
  }

  getAllUsers() {
    return this.httpClient.get<User[]>(this.usersUrl);
  }

  login(userName: string) {
    const loginTime = new Date().toISOString();
    return this.findUserByUsername(userName).pipe(
      tap((user) => {
        if (user) {
          const session = { user, loginTime };
          this._userSession.next(session);
          localStorage.setItem('session', JSON.stringify(session));

          console.log('User logged:', session);
        } else {
          console.log('User not found');
        }
      }),
      catchError((error) => {
        // Handle error (HTTP request error, etc.)
        console.error('Error fetching user:', error);
        throw error;
      }),
    );
  }

  logOut() {
    localStorage.removeItem('session');
    this._userSession.next(null);
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

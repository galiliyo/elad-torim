import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Doctor } from '@appRoot/types/doctors.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService implements OnDestroy {
  httpClient = inject(HttpClient);
  doctorsUrl = `${environment.baseUrl}/doctors`;
  private _unsubscribe$ = new Subject<void>();
  private _doctors = new BehaviorSubject<Doctor[]>([]);
  public doctors$ = this._doctors as Observable<Doctor[]>;

  constructor() {
    this.loadAllDoctors();
  }

  loadAllDoctors() {
    this.httpClient
      .get<Doctor[]>(this.doctorsUrl)
      .pipe(
        takeUntil(this._unsubscribe$),
        catchError((error) => {
          console.error('Error fetching Doctors:', error);
          return [];
        }),
      )
      .subscribe((doctors: Doctor[]) => {
        this._doctors.next(doctors);
      });
  }

  getDoctorNameById(id: number) {
    return this._doctors.pipe(
      map(
        (docs) =>
          docs
            .filter((doc) => doc.id.toString() === id.toString())
            .map((doc) => `${doc.firstName} ${doc.lastName}`)[0] ||
          'doctor not found',
      ),
    );
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

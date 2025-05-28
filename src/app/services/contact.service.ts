import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  getContacts(): Observable<any[]> {
    return new Observable(observer => {
      this.authService.getCurrentUser().then(user => {
        if (!user) {
          observer.next([]);
          observer.complete();
          return;
        }

        this.firestore
          .collection(`users/${user.uid}/contacts`)
          .valueChanges({ idField: 'id' })
          .subscribe(data => {
            observer.next(data);
            observer.complete();
          });
      });
    });
  }

  contactExistsByPhone(phone: string): Observable<any | null> {
    return new Observable(observer => {
      this.firestore
        .collection('users', ref =>
          ref.where('telefono', '==', phone).limit(1)
        )
        .get()
        .subscribe(snapshot => {
          if (!snapshot.empty) {
            observer.next(snapshot.docs[0].data());
          } else {
            observer.next(null);
          }
          observer.complete();
        });
    });
  }

  testFirestoreQuery() {
    this.firestore.collection('users').valueChanges().subscribe(data => {
      console.log('🔥 Datos de usuarios Firestore:', data);
    });
  }
}

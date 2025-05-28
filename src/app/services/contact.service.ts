import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

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

  async contactExistsByPhone(phone: string): Promise<any | null> {
    console.log('📞 Buscando contacto por número:', phone);

    try {
      const querySnapshot = await this.firestore
        .collection('users', ref => ref.where('telefono', '==', phone).limit(1))
        .get()
        .toPromise();

      if (querySnapshot && !querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }

      return null;
    } catch (error) {
      console.error('❌ Error al verificar contacto (Firestore):', error);
      return null;
    }
  }

  testFirestoreQuery() {
    this.firestore.collection('users').valueChanges().subscribe(data => {
      console.log('🔥 Datos de usuarios Firestore:', data);
    });
  }
}

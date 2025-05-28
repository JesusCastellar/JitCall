import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async initNotifications() {
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token: Token) => {
  const user = await this.authService.getCurrentUser(); // ✅ aquí el await

  if (user) {
    const userRef = this.firestore.doc(`users/${user.uid}`);
    await userRef.update({ token: token.value });
    console.log('Token guardado en Firestore: ', token.value);
  }
});

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Error en registro de notificaciones', err);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida:', notification);
      });
    } else {
      console.log('Permisos de notificación denegados');
    }
  }
}

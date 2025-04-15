import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async initNotifications() {
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token: Token) => {
        const user = this.authService.getCurrentUser();
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          await updateDoc(userRef, { token: token.value });
          console.log('Token guardado en Firestore: ', token.value);
        }
      });

      PushNotifications.addListener('registrationError', (err) => {
        console.error('Error en registro de notificaciones', err);
      });

      // Escuchar notificaciones entrantes
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notificación recibida:', notification);
      });
    } else {
      console.log('Permisos de notificación denegados');
    }
  }
}

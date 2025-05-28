import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false
})
export class AddContactPage {
  phoneNumber: string = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  addContact() {
    const normalizedPhone = this.phoneNumber.replace(/\D/g, '');

    this.authService.getCurrentUser().then(user => {
      if (!user) {
        this.showToast('❌ Usuario no autenticado');
        return;
      }

      this.contactService.contactExistsByPhone(normalizedPhone).subscribe(contactData => {
        if (contactData) {
          this.firestore
            .collection(`users/${user.uid}/contacts`)
            .doc(normalizedPhone)
            .set(contactData)
            .then(() => {
              this.showToast('✅ Contacto agregado exitosamente');
              this.phoneNumber = '';
            });
        } else {
          this.showToast('❌ El contacto no existe');
        }
      });
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'primary',
      position: 'bottom'
    });
    toast.present();
  }

  testConsultaFirestore() {
    this.contactService.testFirestoreQuery();
  }
}

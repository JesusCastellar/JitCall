import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],

  standalone : false

})
export class AddContactPage {
  phoneNumber: string = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private firestore: Firestore,
    private toastController: ToastController
  ) {}

  async addContact() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const contactData = await this.contactService.contactExistsByPhone(this.phoneNumber);
    
    if (contactData) {
      const contactRef = doc(this.firestore, `users/${user.uid}/contacts/${this.phoneNumber}`);
      await setDoc(contactRef, contactData);
      this.showToast('Contacto agregado exitosamente ✅');
      this.phoneNumber = '';
    } else {
      this.showToast('❌ El contacto no existe');
    }
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
}

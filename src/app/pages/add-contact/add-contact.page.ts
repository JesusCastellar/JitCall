// add-contact.page.ts
import { Component } from '@angular/core';
import { ContactsService } from '../../core/services/contacts.service';
import { SesionServicio } from '../../core/services/sesion.servicio';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false,
})
export class AddContactPage {
  name: string = '';
  phone: string = '';

  constructor(
    private contactsService: ContactsService,
    private authService: SesionServicio,
    private navCtrl: NavController,
  ) {}

  async onSubmit() {
    if (this.phone) {
      await this.contactsService.agregarContacto(this.phone, this.name);
      this.navCtrl.navigateRoot('/home');
    }
  }
}

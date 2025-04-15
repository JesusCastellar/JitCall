import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage {
  nombre = '';
  apellido = '';
  email = '';
  telefono = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async register() {
    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();

    try {
      await this.authService.registerUser(
        this.email,
        this.password,
        this.nombre,
        this.apellido,
        this.telefono
      );
      loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: (error as any).message,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}

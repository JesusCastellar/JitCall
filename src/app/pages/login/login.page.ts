import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

  standalone : false


})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    try {
      await this.authService.login(this.email, this.password);
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SesionServicio } from 'src/app/core/services/sesion.servicio';

@Component({
  selector: 'app-acceder',
  templateUrl: './acceder.page.html',
  styleUrls: ['./acceder.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: SesionServicio,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async acceder() {
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.acceder(email, password);
      this.navCtrl.navigateRoot('/home'); // Cambia a la página principal
    } catch (error: any) {
      console.error('Login error', error);
      // Aquí puedes mostrar un Toast o Alert
    }
  }
}

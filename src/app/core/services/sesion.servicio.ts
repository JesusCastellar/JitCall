import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { authState } from 'rxfire/auth';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SesionServicio {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
  ) {}

  // Registrar usuario
  async crearCuenta(user: User, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      user.email,
      password,
    );
    const uid = credential.user.uid;
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
    });
  }

  // Login
  acceder(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  async cerrarSesion(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/acceder']);
  }

  // Observable del estado de autenticación
  getAuthState(): Observable<FirebaseUser | null> {
    return authState(this.auth);
  }

  // Obtener el token
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  async getCurrentUser() {
    return this.auth.currentUser;
  }

  // Obtener UID
  getUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }
}

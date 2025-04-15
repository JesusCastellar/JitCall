import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from 'src/environments/firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  async registerUser(email: string, password: string, nombre: string, apellido: string, telefono: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = doc(db, 'users', uid);
    await setDoc(userDoc, {
      uid,
      email,
      nombre,
      apellido,
      telefono
    });

    return userCredential;
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async logout() {
    return signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

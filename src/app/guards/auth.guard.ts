import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const afAuth = inject(AngularFireAuth);

  const user = await afAuth.currentUser;

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

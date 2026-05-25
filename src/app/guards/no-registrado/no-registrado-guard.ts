import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

export const noRegistradoGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.sesionActiva()) {
        router.navigate(['/login']);
        return false;
    } else {
        return true;
    }
};

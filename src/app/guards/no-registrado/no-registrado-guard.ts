import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

export const noRegistradoGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await authService.esperarInicializacion();

    if (!authService.sesionActiva()) {
        router.navigate(['/login']);
        return false;
    } else {
        return true;
    }
};

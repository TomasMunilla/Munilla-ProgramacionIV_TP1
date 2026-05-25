import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';

export const loginGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await authService.esperarInicializacion(); // espero a que se inicialice la sesión para saber si el usuario está autenticado o no

    if (authService.sesionActiva()) {
        router.navigate(['/home']);
        return false;
    } else {
        return true;
    }
};

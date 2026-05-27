import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';


export const adminGuard: CanActivateFn = async () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    await authService.esperarInicializacion();
    const sesion = authService.sesionActiva();
    
    if (!sesion || !sesion.es_admin) {
        router.navigate(['/home']);
        return false;
    }
    return true;
};
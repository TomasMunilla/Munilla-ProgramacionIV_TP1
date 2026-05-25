import { Routes } from '@angular/router';
import { loginGuard } from './guards/login/login-guard';
import { noRegistradoGuard } from './guards/no-registrado/no-registrado-guard';
// import { Home } from './components/home/home';
// import { Login } from './components/login/login';
// import { Registro } from './components/registro/registro';
// import { QuienSoy } from './components/quien-soy/quien-soy';
// import path from 'path';

export const routes: Routes = [
    { path: '',redirectTo: '/home', pathMatch:'full' },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home').then((m) => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then((m) => m.Login),
        canActivate: [loginGuard] // protejo la ruta de login para que no puedan acceder los usuarios autenticados
    },
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro').then((m) => m.Registro),
        canActivate: [loginGuard]
    },
    {
        path: 'quien-soy',
        loadComponent: () => import('./components/quien-soy/quien-soy').then((m) => m.QuienSoy)
    },
    {
        path: 'home/ahorcado',
        loadComponent: () => import('./components/ahorcado/ahorcado').then((m) => m.Ahorcado),
        canActivate: [noRegistradoGuard] // protejo la ruta del ahorcado para que solo puedan acceder los usuarios autenticados
    },
    {path: '**', loadComponent: () => import('./components/error/error').then((m) => m.Error)}

];


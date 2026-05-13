import { Routes } from '@angular/router';
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
        loadComponent: () => import('./components/login/login').then((m) => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro').then((m) => m.Registro)
    },
    {
        path: 'quien-soy',
        loadComponent: () => import('./components/quien-soy/quien-soy').then((m) => m.QuienSoy)
    },
    {path: '**', loadComponent: () => import('./components/error/error').then((m) => m.Error)}

];


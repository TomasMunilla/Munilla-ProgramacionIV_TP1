import { Routes } from '@angular/router';
import { loginGuard } from './guards/login/login-guard';
import { noRegistradoGuard } from './guards/no-registrado/no-registrado-guard';
import { adminGuard } from './guards/admin-guard/admin-guard';
// import { Home } from './components/home/home';
// import { Login } from './components/login/login';
// import { Registro } from './components/registro/registro';
// import { QuienSoy } from './components/quien-soy/quien-soy';
// import path from 'path';

export const routes: Routes = [
    //{ path: '',redirectTo: '/home', pathMatch:'full' },
    {path: '', loadComponent: () => import('./components/home/home').then((m) => m.Home)},
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
    {
        path: 'home/mayor-menor',
        loadComponent: () => import('./components/mayor-menor/mayor-menor').then((m) => m.MayorMenor),
        canActivate: [noRegistradoGuard]
    },
    {
        path: 'home/chat',
        loadComponent: () => import('./components/chat/chat').then((m) => m.Chat),
        canActivate: [noRegistradoGuard]
    },
    {
        path: 'home/preguntados',
        loadComponent: () => import('./components/preguntados/preguntados').then((m) => m.Preguntados),
        canActivate: [noRegistradoGuard]                
    },
    {
        path: 'home/simon-dice',
        loadComponent: () => import('./components/simon-dice/simon-dice').then((m) => m.SimonDice),
        canActivate: [noRegistradoGuard]
    },
    {
        path: 'home/listados',
        loadComponent: () => import('./components/listados/listados').then((m) => m.Listados),
        canActivate: [noRegistradoGuard]
    },
    {
        path: 'home/encuesta',
        loadComponent: () => import('./components/encuesta/encuesta').then((m) => m.Encuesta),
        canActivate: [noRegistradoGuard]
    },
    {
        path: 'home/resultados-encuesta',
        loadComponent: () => import('./components/resultados-encuesta/resultados-encuesta').then((m) => m.ResultadosEncuesta),
        canActivate: [noRegistradoGuard, adminGuard]
    },
    {path: '**', loadComponent: () => import('./components/error/error').then((m) => m.Error)}

];


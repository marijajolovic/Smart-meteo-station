import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogComponent } from './components/log/log.component';
import { SettingComponent } from './components/setting/setting.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'log', component: LogComponent },
    { path: 'setting', component: SettingComponent },
    { path: '**', redirectTo: '/welcome' }
];

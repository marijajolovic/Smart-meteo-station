import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'meteo';
   items: MenuItem[] | undefined;
   currentUrl: string = '';
   constructor(public router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.urlAfterRedirects; // uvek ažurirano
      });
   }
   ngOnInit() {
        this.items = [
            {
                label: 'Početna',
                icon: 'pi pi-home',
                route: 'home',
            },
            {
                label: 'Podešavanja',
                icon: 'pi pi-sliders-h',
                route: 'setting'
            },
            {
                label: 'Logovi',
                icon: 'pi pi-history',
                route: 'log'
            },
            {
                icon: 'pi pi-power-off',
                command: () => this.iskljuci(),
                styleClass: 'icon-only-menu'
            }
        ]
    }
    iskljuci() {
        this.router.navigate(['/welcome']);
    }

}

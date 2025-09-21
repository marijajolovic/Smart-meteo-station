import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MeteoService } from '../../meteo.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ButtonModule],
  providers: [MeteoService],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  constructor(private router: Router, private senzorService: MeteoService) {}

  ukljuciIIdi() {
    this.senzorService.ukljuciAllSenzor().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Greška pri gašenju/paljenju senzora:', err)
    });
    
  }
}

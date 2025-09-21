import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Senzor } from '../../models/senzor';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MeteoService } from '../../meteo.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule, InputTextModule, TableModule, CommonModule, ButtonModule, HttpClientModule],
  providers: [MeteoService],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  valueTimeSample !: String;
  constructor(private senzorService: MeteoService){}
  ngOnInit(): void {
    this.ucitajSenzore();
    
  }
  senzori!: Senzor[];

    ucitajSenzore(): void {
    this.senzorService.getSenzors().subscribe({
      next: (data) => {
        this.senzori = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju senzora:', err);
      }
    });
  }

    toggleSenzor(s: any): void {
    const newStatus = s.status === 'ON' ? 'OFF' : 'ON';
    this.senzorService.updateSenzor(s.id, { naziv: s.naziv, status: newStatus }).subscribe({
      next: () => {
        s.status = newStatus;
        window.location.reload();
      },
      error: (err) => console.error('Greška pri gašenju/paljenju senzora:', err)
    });
  }

}

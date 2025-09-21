import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgFor } from '@angular/common';

import { Merenje, MerenjeNajnovije, MerenjeRazlika } from '../../models/merenje';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MeteoService } from '../../meteo.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, IconFieldModule, InputTextModule, InputIconModule, DropdownModule, HttpClientModule],
  providers: [MeteoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    currentWeather : String = 'storm';
    merenje!: MerenjeNajnovije [];
    merenjeRazlike!: MerenjeRazlika [];
    temp!: MerenjeNajnovije;
    vlaznost !: MerenjeNajnovije;
    vetar!:MerenjeNajnovije;
  
    tempT !: MerenjeRazlika;
    constructor(private merenjaService: MeteoService){}
    ngOnInit(): void {
      this.temp = {id: 0, senzor_naziv: 'LM35', velicina_naziv: '', vrednost: 0, jedinica: '°C', status: ''};
      this.vlaznost = {id: 0, senzor_naziv: 'DHT11', velicina_naziv: '', vrednost: 0, jedinica: '%', status: ''};
      this.vetar = {id: 0, senzor_naziv: 'GY61', velicina_naziv: '', vrednost: 0, jedinica: 'm/s2', status: ''};
      this.ucitajMerenja();

      
    }

    ucitajMerenja(): void {
    this.merenjaService.getMerenjaTrenutne().subscribe({
      next: (data) => {
        console.log(data);
        this.merenje = data;

        this.merenje.forEach(m => {
          if(m.senzor_naziv === 'LM35'){
            this.temp = m;
          }
          else{
            this.temp = {id: 0, senzor_naziv: 'LM35', velicina_naziv: '', vrednost: 0, jedinica: '°C', status: ''};
          }
          if(m.senzor_naziv === 'DHT11'){
            this.vlaznost = m;
          }
          else{
            this.vlaznost = {id: 0, senzor_naziv: 'DHT11', velicina_naziv: '', vrednost: 0, jedinica: '%', status: ''};
          }
          if(m.senzor_naziv === 'GY61'){
            this.vetar = m;
          }
          else{
            this.vetar = {id: 0, senzor_naziv: 'GY61', velicina_naziv: '', vrednost: 0, jedinica: 'm/s2', status: ''};
          }
        });
      },
      error: (err) => {
        console.error('Greška pri učitavanju senzora:', err);
      }
    });
  }
}

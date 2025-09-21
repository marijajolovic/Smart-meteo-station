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
import { RealtimedataService } from '../../realtimedata.service';
import { FormsModule } from "@angular/forms";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, IconFieldModule, InputTextModule, InputIconModule, DropdownModule, HttpClientModule, FormsModule],
  providers: [MeteoService, RealtimedataService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    currentWeather : String = 'storm';
    merenje!: MerenjeNajnovije[];
    merenjeRazlike!: MerenjeRazlika [];
    temp!: MerenjeNajnovije;
    vlaznost !: MerenjeNajnovije;
    vetar!:MerenjeNajnovije;
  
    tempT !: MerenjeRazlika;
    constructor(private merenjaService: MeteoService, private serviceRealTime: RealtimedataService){}
    ngOnInit(): void {
      this.merenje = [
        {
          id: 0,
          senzor_naziv: "kada me prvi put pokrenes",
          velicina_naziv: "Cekam sveze podatke",
          vrednost: 0,
          jedinica: "",
          status: "ON",
        }
      ]
      this.ucitajMerenja(); 
    }

    ucitajMerenja(): void {
    this.serviceRealTime.getArduinoData().subscribe({
      next: (data) => {
        
        this.merenje = data;
        console.log(this.merenje);
        
        
      },
      error: (err) => {
        console.error('Greška pri učitavanju senzora:', err);
      }
    });
  }
}

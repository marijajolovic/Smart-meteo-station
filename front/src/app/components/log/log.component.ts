import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Merenje } from '../../models/merenje';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MeteoService } from '../../meteo.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,  IconFieldModule, InputTextModule, InputIconModule, HttpClientModule],
  providers: [MeteoService],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent {
  merenje!: Merenje[];
  

  ngOnInit(): void {
    this.ucitajMerenja();
  }

  constructor(private merenjaService: MeteoService){}

  ucitajMerenja(): void {
    this.merenjaService.getMerenja().subscribe({
      next: (data) => {
        this.merenje = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju senzora:', err);
      }
    });
  }
}

import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

import { Merenje } from '../../models/merenje';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, IconFieldModule, InputTextModule, InputIconModule, DropdownModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentWeather : String = 'storm';
  merenje: Merenje []= [
    {
      id: 1,
      senzor: {
        id: 1,
        name: 'LM35',
        status: 'On'
      },
      velicina: {
        id: 1,
        jedinica: 'C',
        name: 'Osvetljenost'
        
      },
      vrednost: 20,
      date: '10-02-2024',
    },
    {
      id: 1,
      senzor: {
        id: 1,
        name: 'LM35',
        status: 'On'
      },
      velicina: {
        id: 1,
        jedinica: 'C',
        name: 'Temperatura'
        
      },
      vrednost: 20,
      date: '10-02-2024',
    },
    {
      id: 1,
      senzor: {
        id: 1,
        name: 'LM35',
        status: 'On'
      },
      velicina: {
        id: 1,
        jedinica: 'C',
        name: 'Vlaznost'
        
      },
      vrednost: 20,
      date: '10-02-2024',
    },
    {
      id: 1,
      senzor: {
        id: 1,
        name: 'LM35',
        status: 'On'
      },
      velicina: {
        id: 1,
        jedinica: 'C',
        name: 'Temperatura'
        
      },
      vrednost: 20,
      date: '10-02-2024',
    }
  ];
  }

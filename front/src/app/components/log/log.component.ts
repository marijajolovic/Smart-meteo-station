import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Merenje } from '../../models/merenje';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,  IconFieldModule, InputTextModule, InputIconModule],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent {
merenje: Merenje[]=[
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
        name: 'Temperatura'
        
      },
      vrednost: 20,
      date: '10-02-2024',
    }
  ];
}

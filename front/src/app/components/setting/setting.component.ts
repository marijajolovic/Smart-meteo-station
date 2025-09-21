import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Senzor } from '../../models/senzor';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [FormsModule, InputTextModule, TableModule, CommonModule, ButtonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  valueTimeSample: string | undefined;

  senzori: Senzor[]=[
      {
          id: 1,
          name: 'LM35',
          status: 'On'
      },
       {
          id: 1,
          name: 'LM35',
          status: 'Off'
      }
    ];
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { MerenjeNajnovije } from './models/merenje';

@Injectable({
  providedIn: 'root'
})
export class RealtimedataService {

  constructor() { }

  private socket: Socket = io('http://localhost:3000/', {
    transports: ['websocket'],
    withCredentials: true
  });

  getArduinoData(): Observable<MerenjeNajnovije[]> {
    return new Observable(observer => {
      this.socket.on('arduino-data', (data: MerenjeNajnovije[]) => {
        observer.next(data);
      });
    });
  }
}

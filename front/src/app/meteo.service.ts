import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Senzor } from './models/senzor';
import { Merenje,MerenjeNajnovije, MerenjeRazlika } from './models/merenje';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  getSenzors(): Observable<Senzor[]> {
    return this.http.get<Senzor[]>(this.apiUrl+'/senzori');
  }

  getMerenja(): Observable<Merenje[]>{
    return this.http.get<Merenje[]>(this.apiUrl+'/merenja');
  }

  getMerenjaTrenutne(): Observable<MerenjeNajnovije[]>{
    return this.http.get<MerenjeNajnovije[]>(this.apiUrl+'/merenja/latest');
  }

  updateSenzor(id: number, senzor: {status: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/senzori/${id}`, senzor);
  }

  ukljuciAllSenzor(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/senzori/ukljuci`,{});
  }
  iskljuciAllSenzor(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/senzori/iskljuci`,{});
  }

   updateInterval(vreme: Number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/podesavanja/interval`, {"interval" : vreme});
  }

}

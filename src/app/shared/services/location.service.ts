import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable, of } from 'rxjs';
import { Country } from '../models/country';
import { catchError, tap } from 'rxjs/operators';
import { HandleErrorService } from '../handleErrorService';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient, private handleErrorService: HandleErrorService) { }

  getCountries(): Observable<Country[]> {
    const uri = decodeURIComponent(`${Constants.resourceUrl}/countries?apikey=${Constants.apikey}`);

    return this.http.get<Country[]>(uri).pipe(
      tap(_ => console.log('fetched countries'),
      catchError(this.handleErrorService.handleError('getCountries', []))
      ));
  }
}


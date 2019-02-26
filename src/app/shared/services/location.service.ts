import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { Observable, of } from 'rxjs';
import { Country } from '../models/country';
import { catchError, tap, map } from 'rxjs/operators';
import { HandleErrorService } from '../handleErrorService';
import { City } from '../models/city';

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

  getCities(searchText: string, countryCode: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const uri = countryCode ? decodeURIComponent(`${Constants.resourceUrl}/cities/${countryCode}/search?apiKey=${Constants.apikey}&q=${searchText}`)
                            : decodeURIComponent(`${Constants.resourceUrl}/cities/search?apiKey=${Constants.apikey}&q=${searchText}`);

    return this.http.get<City[]>(uri).pipe(
      map(res => (res as City[]).map(c => {
        return {
        Key: c.Key,
        Type: c.Type,
        EnglishName: c.EnglishName,
        Country: {
          ID: c.Country.ID,
          EnglishName: c.Country.ID}
        }; })),
      tap(_ => console.log('feteched cities')),
      catchError(this.handleErrorService.handleError('getCities', {}))
    );
  }
}


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentConditions } from '../models/current-conditions';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { HandleErrorService } from '../handleErrorService';

@Injectable({
  providedIn: 'root'
})
export class CurrentConditionsService {

  constructor(private http: HttpClient, private handleErrorService: HandleErrorService) { }

  getCurrentCondition(locationKey: string): Observable<CurrentConditions []> {
    const uri = `${Constants.resourceConditionsUrl}/${locationKey}?apikey=${Constants.apikey}`;
    return this.http.get(uri).pipe(tap(_ => console.log('fetched current conditions')),
      catchError(this.handleErrorService.handleError('getCurrentCondition', null)
      ));
  }
}

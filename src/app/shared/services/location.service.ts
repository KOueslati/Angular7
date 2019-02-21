import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient) { }

  getCountries(){
    return this.httpClient.get(Constants.resourceUrl + '/countries?apikey='+ Constants.apikey)
      .map((res: Response) => {
        res.json();
    })
  }
}

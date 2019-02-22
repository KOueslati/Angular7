import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../shared/services/location.service';
import { Country } from '../shared/models/country';
import { resolve } from 'url';
import { reject } from 'q';
import { error } from 'util';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private weatherForm: FormGroup;
  private countries: Country[];
  constructor(private fb: FormBuilder, private locationService: LocationService) { }

  async ngOnInit() {
    this.weatherForm = this.buildFormGroup();
    await this.getCountriesAsync();
  }

  getCountries() {
    return this.locationService.getCountries().subscribe(countries => this.countries = countries);
  }
  async getCountriesAsync() {
    // tslint:disable-next-line: no-shadowed-variable
    const promise = new Promise((resolve, reject) => {
      this.locationService.getCountries()
        .toPromise()
        .then(
          // Success
          (countries) => {
            this.countries = countries;
            resolve();
          },
          // Error
          (err) => {
            console.error(err);
            reject(err);
          });
    });

    await promise;
  }

  buildFormGroup() {
    return this.fb.group({
      searchGroup: this.fb.group({
        city: ['', Validators.required],
        country: ['']
      })
    });
  }

}

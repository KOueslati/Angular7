import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../shared/services/location.service';
import { Country } from '../shared/models/country';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private weatherForm: FormGroup;
  private countries: Country[];

  @ViewChild('instanceCountry') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

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

  formatterCountry = (country: Country) => country.EnglishName;

  searchCountry = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clickWithoutClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clickWithoutClosedPopup$).pipe(
      map(val => val === '' ? this.countries.slice(0, 10)
        : this.countries.filter(c => c.EnglishName.toLowerCase().indexOf(val.toLowerCase()) > -1).slice(0, 10)));
  }
}

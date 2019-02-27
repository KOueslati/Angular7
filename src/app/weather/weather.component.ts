import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService } from '../shared/services/location.service';
import { Country } from '../shared/models/country';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { City } from '../shared/models/city';
import { Weather } from '../shared/models/weather';
import { CurrentConditionsService } from '../shared/services/current-conditions.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private weatherForm: FormGroup;
  private countries: Country[];
  private city: City;
  private weather: Weather;
  private messageError: string;
  @ViewChild('instanceCountry') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  get cityControl(): FormControl {
    return this.weatherForm.get('searchGroup.city') as FormControl;
  }

  public get countryControl(): FormControl {
    return this.weatherForm.get('searchGroup.country') as FormControl;
  }

  // tslint:disable-next-line: max-line-length
  constructor(private fb: FormBuilder, private locationService: LocationService, private currentConditionsService: CurrentConditionsService) { }

  async ngOnInit() {
    this.weatherForm = this.buildFormGroup();
    await this.getCountriesAsync();
  }

  buildFormGroup() {
    return this.fb.group({
      searchGroup: this.fb.group({
        city: ['', Validators.required],
        country: ['']
      })
    });
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



  formatterCountry = (country: Country) => country.EnglishName;

  searchCountry = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clickWithoutClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clickWithoutClosedPopup$).pipe(
      map(val => val === '' ? this.countries.slice(0, 10)
        : this.countries.filter(c => c.EnglishName.toLowerCase().indexOf(val.toLowerCase()) > -1).slice(0, 10)));
  }



  async getCitiesAsync() {
    const countrySelected = this.countryControl.value;
    const searchText = this.cityControl.value;
    if (countrySelected as Country) {
      const countryCode = (countrySelected as Country).ID;
      const promise = new Promise((resolve, reject) => {
        this.locationService.getCities(searchText, null)
          .toPromise()
          .then(res => {
            const cities = (res as City[]);
            if (cities.length === 0) {
              this.messageError = `There are no location found for this ${searchText}`;
              console.error(this.messageError);
            }
            this.city = cities[0];
            resolve();
          },
            err => {
              reject(err);
            }
          );
      });
      await promise;
      const countryName = this.countries.filter(c => c.ID === this.city.Country.ID)[0].EnglishName;
      if (this.city) {
        this.weatherForm.patchValue({
          City: this.city.EnglishName,
          Country: countryName
        });
      }
    }
  }

  async getCurrentConditions() {
    const promise = new Promise((resolve, reject) => {
      this.currentConditionsService.getCurrentCondition(this.city.Key)
        .toPromise()
        .then(conditions => {
          if (conditions.length === 0) {
            this.messageError = 'weather is not available';
            console.error(this.messageError);
          }

          this.weather = new Weather(this.city, conditions[0]);
          resolve();
        },
          error => reject(error));
    });

    await promise;
  }

  async search() {
    this.weather = null;
    this.messageError = null;
// tslint:disable-next-line: max-line-length
    if (!this.city || this.city.EnglishName !== (this.cityControl.value as string) || !this.city.Key || ! this.city.Country || !this.city.Country.ID) {
      await this.getCitiesAsync();
    }
    await this.getCurrentConditions();
  }
}

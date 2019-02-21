import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  private weatherForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.weatherForm = this.buildFormGroup();
  }

  buildFormGroup() {
    return this.fb.group({
      searchGroup: this.fb.group({
        city: ['', Validators.required],
        country: ['']})
    });
  }

}

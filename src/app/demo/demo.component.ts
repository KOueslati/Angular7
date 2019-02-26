import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {

  constructor(private fb: FormBuilder) { }

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    address: this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
      aliases: this.fb.array([
        this.fb.control('')
      ])
  });

  updateProfile() {
    this.profileForm.patchValue({
      firstName: '',
      lastName: 'Oueslati',
      address: {
        city: 'Marseille',
        street: '7 boulevard saint martin'
      }
    });
  }

  saveProfile() {
    this.profileForm.patchValue({
     address: {
       zip: '75017'
      }
    });
  }

  get aliases(){
    return this.profileForm.get('aliases') as FormArray;
  }

  addAlias(){
    this.aliases.push(this.fb.control(''));
  }
}

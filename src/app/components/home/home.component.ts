import { Component, OnInit } from '@angular/core';
import { BikeService } from '../../services/bike.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  models: string[] = [
    'Globo MTB 29 Full Suspension',
    'Globo Carbon Fiber Race Series',
    'Globo Time Trial Blade'
  ];
  bikeform!: FormGroup;
  validMessage: string = '';

  constructor(private bikeService: BikeService) { }

  ngOnInit(): void {
    this.bikeform = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('',Validators.required),
      phone: new FormControl('',Validators.required),
      model: new FormControl('',Validators.required),
      serialNumber: new FormControl('',Validators.required),
      purchasePrice: new FormControl('',[Validators.required,Validators.pattern('^(\\d*\\.)?\\d+$')]),
      purchaseDate: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{2}-[0-9]{2}-[0-9]{4}')]),
      contact: new FormControl()
      })
    }
  submitRegistration(){
    if(this.bikeform.get('purchasePrice')?.invalid) this.validMessage = "Purchase Price must be a number. "
    else if(this.bikeform.get('purchaseDate')?.invalid) this.validMessage = "Purchase Date must be DD-MM-YYYY format. "
    else if (this.bikeform.valid) {
     
      this.bikeService.createBikeRegistration(this.bikeform.value).subscribe(
        data => {
          this.validMessage = "Your bike registration has been submited. Thank you."
          this.bikeform.reset();
          return true; 
        },
        error => {
          return Observable.throw(error);
        }
      )
    }
    else {
      this.validateAllFormFields(this.bikeform);
      this.validMessage = "Please fill out the form before submitting !"
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
  Object.keys(formGroup.controls).forEach(field => {  //{2}
    const control = formGroup.get(field);             //{3}
    if (control instanceof FormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        //{5}
      this.validateAllFormFields(control);            //{6}
    }
  });
}

}

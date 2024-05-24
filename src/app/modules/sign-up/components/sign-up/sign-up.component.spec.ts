import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
//import { Router } from '@angular/router';

import { of } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  //let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      signUp: jasmine.createSpy('signUp').and.returnValue(of())
    };

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        FormBuilder
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    //router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock?.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signUp method of AuthService when submit is invoked and data is correct', () => {
    component.form.controls['name'].setValue('John');
    component.form.controls['surname'].setValue('Doe');
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('Test!123');
    component.form.controls['confirmPassword'].setValue('Test!123');

    component.submit();

    expect(authService.signUp).toHaveBeenCalledWith({
      customer_id: 0,
      customer_email: 'test@example.com',
      customer_is_admin: false,
      customer_name: 'John',
      customer_surname: 'Doe',
      customer_phone: '',
      customer_password: 'Test!123',
      customer_nip_number: '',
      customer_city: '',
      customer_postal_code: '',
      customer_street: '',
      customer_building_number: ''
    });
  });
});

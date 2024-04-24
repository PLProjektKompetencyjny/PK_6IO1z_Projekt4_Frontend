import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

@NgModule({
  declarations: [],
  exports: [
    RouterModule,
    CommonModule
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  providers: [AuthService],
})
export class SharedModule { }

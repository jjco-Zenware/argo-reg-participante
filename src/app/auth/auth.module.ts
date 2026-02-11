import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MsalModule } from '@azure/msal-angular';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';
import { CAuthComponent } from './c-auth/c-auth.component';
import { SharedAppModule } from '../shared/shared-App.module';
import { SharedPrimeNgModule } from '@primeNgModule';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CAuthComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPrimeNgModule,
    SharedAppModule,
    MsalModule
  ],
  providers:[
    AuthService,SharedAppService, DynamicDialogRef, DynamicDialogConfig
  ]
})
export class AuthModule { }

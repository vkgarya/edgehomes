import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddHomePageRoutingModule } from './add-home-routing.module';

import { AddHomePage } from './add-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddHomePageRoutingModule
  ],
  declarations: [AddHomePage]
})
export class AddHomePageModule {}

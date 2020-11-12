import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestapiPageRoutingModule } from './testapi-routing.module';

import { TestapiPage } from './testapi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestapiPageRoutingModule
  ],
  declarations: [TestapiPage]
})
export class TestapiPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedPageRoutingModule } from './shared-routing.module';
import { HeaderPage } from './header/header.page';
import { FooterPage } from './footer/footer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPageRoutingModule
  ],
  exports:[
   // SharedPageModule
  ],
  declarations: [HeaderPage, FooterPage]
})
export class SharedPageModule {}

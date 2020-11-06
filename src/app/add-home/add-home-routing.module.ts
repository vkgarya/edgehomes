import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddHomePage } from './add-home.page';

const routes: Routes = [
  {
    path: '',
    component: AddHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddHomePageRoutingModule {}

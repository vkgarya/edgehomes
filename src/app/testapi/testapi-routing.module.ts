import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestapiPage } from './testapi.page';

const routes: Routes = [
  {
    path: '',
    component: TestapiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestapiPageRoutingModule {}

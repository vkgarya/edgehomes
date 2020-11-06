import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterPage } from './footer/footer.page';
import { HeaderPage } from './header/header.page';

const routes: Routes = [
  {
    path: 'header',
    component: HeaderPage
  },
  {
    path: 'footer',
    component: FooterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'service',
        loadChildren: () => import('../service/service.module').then(m => m.ServicePageModule)
      },
      {
        path: 'photos',
        loadChildren: () => import('../photos/photos.module').then(m => m.PhotosPageModule)
      },
      {
        path: 'design',
        loadChildren: () => import('../design/design.module').then(m => m.DesignPageModule)
      },
      {
        path: 'progress',
        loadChildren: () => import('../progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: 'more',
        loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

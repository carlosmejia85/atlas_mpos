import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }, 
  {
    path: 'viewtransaction',
    loadChildren: () => import('../viewtransaction/viewtransaction.module') .then( m => m.ViewtransactionPageModule   )
  },  
  {
    path: 'signature',
    loadChildren: () => import('../signature/signature.module')             .then( m => m.SignaturePageModule         )
  },
  {
    path: 'status',
    loadChildren: () => import('../status/status.module')                   .then( m => m.StatusPageModule            )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

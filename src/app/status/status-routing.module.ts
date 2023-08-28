import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusPage } from './status.page';

const routes: Routes = [
  {
    path: '',
    component: StatusPage
  }, 
  {
    path: 'viewtransaction',
    loadChildren: () => import('../viewtransaction/viewtransaction.module') .then( m => m.ViewtransactionPageModule   )
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvertmodalPage } from './convertmodal.page';

const routes: Routes = [
  {
    path: '',
    component: ConvertmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConvertmodalPageRoutingModule {}

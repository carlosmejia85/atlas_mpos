import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminalconfigPage } from './terminalconfig.page';

const routes: Routes = [
  {
    path: '',
    component: TerminalconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalconfigPageRoutingModule {}

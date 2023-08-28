import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*
  {
    path: '',
    loadChildren: () => import('./onboard/onboard.module').then( m => m.OnboardPageModule)
  },
*/

  {
    path: '',
    redirectTo: 'signin', // TODO: Set this to ''
    pathMatch: 'full'
  },
  
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
/*
  {
    path: '',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  */
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'onboard',
    loadChildren: () => import('./onboard/onboard.module').then( m => m.OnboardPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'passrecovery',
    loadChildren: () => import('./passrecovery/passrecovery.module').then( m => m.PassrecoveryPageModule)
  },
  {
    path: 'successmodal',
    loadChildren: () => import('./modals/successmodal/successmodal.module').then( m => m.SuccessmodalPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'otpauth',
    loadChildren: () => import('./otpauth/otpauth.module').then( m => m.OtpauthPageModule)
  },
  {
    path: 'otpphone',
    loadChildren: () => import('./otpphone/otpphone.module').then( m => m.OtpphonePageModule)
  },
  {
    path: 'otpverify',
    loadChildren: () => import('./otpverify/otpverify.module').then( m => m.OtpverifyPageModule)
  },
  {
    path: 'setupfaceid',
    loadChildren: () => import('./setupfaceid/setupfaceid.module').then( m => m.SetupfaceidPageModule)
  },
  {
    path: 'setupfingerprint',
    loadChildren: () => import('./setupfingerprint/setupfingerprint.module').then( m => m.SetupfingerprintPageModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./portfolio/portfolio.module').then( m => m.PortfolioPageModule)
  },
  {
    path: 'stockdetail',
    loadChildren: () => import('./stockdetail/stockdetail.module').then( m => m.StockdetailPageModule)
  },
  {
    path: 'exchangemodal',
    loadChildren: () => import('./modals/exchangemodal/exchangemodal.module').then( m => m.ExchangemodalPageModule)
  },
  {
    path: 'convertmodal',
    loadChildren: () => import('./modals/convertmodal/convertmodal.module').then( m => m.ConvertmodalPageModule)
  },
  {
    path: 'buy',
    loadChildren: () => import('./buystock/buystock.module').then( m => m.BuystockPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'test3',
    loadChildren: () => import('./test3/test3.module').then( m => m.Test3PageModule)
  },
  {
    path: 'selectpaymentmodal',
    loadChildren: () => import('./modals/selectpaymentmodal/selectpaymentmodal.module').then( m => m.SelectpaymentmodalPageModule)
  },
  {
    path: 'confirmorder',
    loadChildren: () => import('./confirmorder/confirmorder.module').then( m => m.ConfirmorderPageModule)
  },
  {
    path: 'transcomplete',
    loadChildren: () => import('./transcomplete/transcomplete.module').then( m => m.TranscompletePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'status',
    loadChildren: () => import('./status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'editprofile',
    loadChildren: () => import('./editprofile/editprofile.module').then( m => m.EditprofilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'referral',
    loadChildren: () => import('./referral/referral.module').then( m => m.ReferralPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./signature/signature.module').then( m => m.SignaturePageModule)
  },
  {
    path: 'viewtransaction',
    loadChildren: () => import('./viewtransaction/viewtransaction.module').then( m => m.ViewtransactionPageModule)
  },
  {
    path: 'terminalconfig',
    loadChildren: () => import('./terminalconfig/terminalconfig.module').then( m => m.TerminalconfigPageModule)
  },
  {
    path: 'bluetooth',
    loadChildren: () => import('./bluetooth/bluetooth.module').then( m => m.BluetoothPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

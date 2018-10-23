import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AgmCoreModule } from '@agm/core';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {HttpModule} from '@angular/http'
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {TutorialsPage} from '../pages/tutorials/tutorials';
import {DashboardPage} from '../pages/dashboard/dashboard';
import {MyOrdersPage} from '../pages/my-orders/my-orders'
import {ViewOrdersPage} from '../pages/view-orders/view-orders';
import {FinalizeOrderPage} from '../pages/finalize-order/finalize-order'
import {SignupPage} from '../pages/signup/signup';
import {ViewTransanctionHistoryPage} from '../pages/view-transanction-history/view-transanction-history'
import {UserOrderPage} from '../pages/user-order/user-order'
//branch pages
import {BranchDashboardPage} from '../pages/branch-dashboard/branch-dashboard';
//modals
import {DeliveryRequestModalPage} from '../modal/delivery-request-modal/delivery-request-model'
import {UserConfirmationModalPage} from '../modal/user-confirmation-modal/user-confirmation-modal'
//component
import {PopupMenuComponent} from '../components/popupMenu1/popMenu1.components'
//services
import {GeneralService} from '../services/general.service';
import {RequestService} from '../services/requestServices/requestServices.service'
import {UsersServices} from '../services/requestServices/usersServices.service'
import {ClientService} from '../services/requestServices/clientService.service';
import {ItemServices} from '../services/requestServices/itemService.service'
import {LocationService} from '../services/requestServices/locationService.service'
//singleton
import {GlobalDataService} from '../services/singleton/globaldata.data'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TutorialsPage,
    DashboardPage,
    MyOrdersPage,
    ViewOrdersPage,
    FinalizeOrderPage,
    SignupPage,
    ViewTransanctionHistoryPage,
    UserOrderPage,
    //branch dashboard page
    BranchDashboardPage,
    //components
    PopupMenuComponent,
    //modals
    DeliveryRequestModalPage,
    UserConfirmationModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAw5ZSkjW2ZSsBDpog08_k54TPCUJ8fyPU',
      libraries: ["places"]
    }),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TutorialsPage,
    DashboardPage,
    MyOrdersPage,
    ViewOrdersPage,
    FinalizeOrderPage,
    SignupPage,
    ViewTransanctionHistoryPage,
    UserOrderPage,
    //branch pages
    BranchDashboardPage,
    //components
    PopupMenuComponent,
    //modals
    DeliveryRequestModalPage,
    UserConfirmationModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //services
    GeneralService,
    RequestService,
    UsersServices,
    ClientService,
    ItemServices,
    LocationService,
    //singleton services
    GlobalDataService
  ]
})
export class AppModule {}

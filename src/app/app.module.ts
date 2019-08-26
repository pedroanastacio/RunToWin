import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { GooglePlus } from '@ionic-native/google-plus';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { HistoricoCorridasPage } from '../pages/historico-corridas/historico-corridas';
import { CorridasProvider } from '../providers/corridas/corridas';
import { ProdutosPage } from '../pages/produtos/produtos';
import { ProdutosProvider } from '../providers/produtos/produtos';
import { AddProdutosPage } from '../pages/add-produtos/add-produtos';
import { EditPerfilPageModule } from '../pages/edit-perfil/edit-perfil.module';
import { ShowProdutoPageModule } from '../pages/show-produto/show-produto.module';
import { MeusCuponsPage } from '../pages/meus-cupons/meus-cupons';
import { MapaCorridaPage } from '../pages/mapa-corrida/mapa-corrida';
import { ShowProdutoPage } from '../pages/show-produto/show-produto';
import { EditPerfilPage } from '../pages/edit-perfil/edit-perfil';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { IonicStorageModule } from '@ionic/storage';
import { Stepcounter } from '@ionic-native/stepcounter';
import { Pedometer } from '@ionic-native/pedometer';
import { ImagePicker } from '@ionic-native/image-picker';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoadingController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CadastroPage,
    PerfilPage,
    HistoricoCorridasPage,
    ProdutosPage,
    AddProdutosPage,
    MeusCuponsPage,
    MapaCorridaPage  
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp({
      apiKey: "*****************************",
      authDomain: "runtowin-c739f.firebaseapp.com",
      databaseURL: "https://runtowin-c739f.firebaseio.com",
      projectId: "runtowin-c739f",
      storageBucket: "runtowin-c739f.appspot.com",
      messagingSenderId: "411395556040"
    }),
    AngularFireDatabaseModule,
    NgxErrorsModule,
    EditPerfilPageModule,
    ShowProdutoPageModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PerfilPage,
    CadastroPage,
    HistoricoCorridasPage,
    ProdutosPage,
    AddProdutosPage,
    MeusCuponsPage,
    MapaCorridaPage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AngularFireAuth,
    GooglePlus,
    Geolocation,
    Stepcounter,
    Pedometer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuariosProvider,
    CorridasProvider,
    ProdutosProvider,
    ImagePicker,
    Clipboard,
    InAppBrowser,
    ScreenOrientation,
    LoadingController,
    BackgroundMode,
    LocalNotifications
  ]
})
export class AppModule {}

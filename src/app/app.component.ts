import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { HistoricoCorridasPage } from '../pages/historico-corridas/historico-corridas';
import { ProdutosPage } from '../pages/produtos/produtos';
import { MeusCuponsPage } from '../pages/meus-cupons/meus-cupons';
import { AuthService } from '../services/auth.service';
import { AddProdutosPage } from '../pages/add-produtos/add-produtos';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { KmPointsUserModel } from '../models/KmPointsUserModel';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private menu: MenuController;

	rootPage:any = LoginPage;

  pages: Array<{title: string, component: any}>;
	
  
  @ViewChild(Nav) nav: Nav;
  dbKmPointsUser: any;
  kmPoints: any;
  kmPointsArred: any;
  temKmPoints:boolean = false;
  uid: string;
  loading: any;

  name: any;
  photoUrl: any;
  email: any;
  useGoogle: boolean = true;
   
  userperfils: Observable<any>;
  
  constructor(public platform: Platform, menu: MenuController, public statusBar: StatusBar, public splashScreen: SplashScreen,
  private auth: AuthService, public afAuth: AngularFireAuth, public provider: UsuariosProvider, private screenOrientation: ScreenOrientation,
  public loadingController:LoadingController){
    this.menu = menu;
    this.initializeApp();
    
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Corrida', component: HomePage },
      { title: 'Histórico de corridas', component: HistoricoCorridasPage},
      { title: 'Cupons', component: ProdutosPage},
      { title: 'Meus cupons', component: MeusCuponsPage},
      { title: 'Perfil', component: PerfilPage },
      
    ];

  }

  initializeApp() {
    this.loading = this.loadingController.create();
    this.loading.present();
    this.rootPage = LoginPage;
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.auth.afAuth.authState
    .subscribe(
      user => {
        if (user) {
          var user = firebase.auth().currentUser;
          if (user != null) {
          this.name = user.displayName;
          this.email = user.email;
          this.photoUrl = user.photoURL;
          this.useGoogle = true;
          }
          if(this.photoUrl == null){
            this.useGoogle = false;
            this.userperfils = this.provider.getPerfil();
          }
          this.loading.dismissAll();
          this.rootPage = HomePage;
          this.uid = this.afAuth.auth.currentUser.uid
          var ref = firebase.database().ref("usuarios/" + this.uid)
          ref.once("value", (snapshot)=> {
            if(snapshot.child("dados").exists()){
              var ref2 = firebase.database().ref("usuarios/" + this.uid + '/dados/')
              this.temKmPoints = true;
              this.dbKmPointsUser = new Array();
              ref2.on("value", (dataSnapshot) => {
                let users = dataSnapshot.val();
                for(let kmPointsUser in users){
                  this.dbKmPointsUser.push(
                    this.kmPoints =  new KmPointsUserModel(
                          users[kmPointsUser].KmPointsUser,
                      )
                  )}
                 
                  this.kmPoints = users.KmPointsUser;
                  this.kmPointsArred = parseInt(this.kmPoints);
              })
            }    
          }); 	
          
        } else {
          this.loading.dismissAll();
          this.rootPage = LoginPage;
        }
      },
      () => {
        this.loading.dismissAll();
        this.rootPage = LoginPage;
      }
    );

    
}
  
  
  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

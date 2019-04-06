import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../services/auth.service';
import { PerfilPage } from '../pages/perfil/perfil';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private menu: MenuController;

	rootPage:any = HomePage;

  pages: Array<{title: string, component: any}>;
	
  
  @ViewChild(Nav) nav: Nav;

 
  constructor(public platform: Platform, menu: MenuController, public statusBar: StatusBar, public splashScreen: SplashScreen,
     private auth: AuthService){
      this.menu = menu;
      this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Perfil', component: PerfilPage },
    ];

  }

  initializeApp() {
    this.rootPage = LoginPage;
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
  });


this.auth.afAuth.authState
  .subscribe(
    user => {
      if (user) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    },
    () => {
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

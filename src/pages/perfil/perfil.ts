import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { LoginPage } from '../login/login';
import { EditPerfilPage } from '../edit-perfil/edit-perfil';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  userperfils: Observable<any>;
 
  useGoogle: boolean = false;
  name: any;
  photoUrl: any;
  email: any;

  constructor(private auth: AuthService, public navCtrl: NavController, public navParams: NavParams, 
    private provider: UsuariosProvider, public afAuth: AngularFireAuth) {
      this.userperfils = this.provider.getPerfil();

      this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            var user = firebase.auth().currentUser;
            if (user != null) {
            this.name = user.displayName;
            this.email = user.email;
            this.photoUrl = user.photoURL;
            if(this.photoUrl != null){
              this.useGoogle = true;
             
            }
            }
          }      
        } 
      )
      }          


  editPerfil(){
    let cadastro = "editar";
    this.navCtrl.push(EditPerfilPage, {cadastro}); 
    
  }

  logout() {
	   this.auth.signOut();
	   this.navCtrl.setRoot(LoginPage);
}

}

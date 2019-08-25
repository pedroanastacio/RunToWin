import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CadastroPage } from '../cadastro/cadastro';

import { AuthService } from '../../services/auth.service';
import { EditPerfilPage } from '../edit-perfil/edit-perfil';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  loginForm: FormGroup;
  loginError: string;
  loading: any;

constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
fb: FormBuilder, private alertCtrl: AlertController, public afAuth: AngularFireAuth, public loadingController:LoadingController) {
	
	this.loginForm = fb.group({
		email: ['', Validators.compose([Validators.required, Validators.email])],
		password: ['', Validators.compose([Validators.required, Validators.minLength(7)])]
	});
}
	

login() {
	this.loading = this.loadingController.create({ content: "Entrando..." });
    this.loading.present();
	let data = this.loginForm.value;

	if (!data.email) {
		return;
	}

	let credentials = {
		email: data.email,
		password: data.password
	};
	this.auth.signInWithEmail(credentials)
		.then((result) => {
			if (result != null) {
				this.loading.dismissAll();
				this.navCtrl.setRoot(HomePage);
			}
		})
		.catch((error:any) => {
			this.loading.dismissAll();
			let alert = this.alertCtrl.create({
				title: 'Erro ao entrar',
				subTitle: 'Email ou senha incorretos.',
				buttons: [{text: 'Ok',
				cssClass: 'buttonAlert'
				}],
				cssClass: 'alertLogin'
		});
	alert.present(); 
		})
							
}

signup(){
  this.navCtrl.push(CadastroPage);
}

loginWithGoogle() {
	this.loading = this.loadingController.create({ content: "Entrando..." });
    this.loading.present();
	this.auth.signInWithGoogle().then((result) =>{
		if(result != null){
			var ref = firebase.database().ref("usuarios/" + this.afAuth.auth.currentUser.uid)
			ref.once("value", (snapshot)=> {
			
			if(!snapshot.child("perfil").exists()){
				this.loading.dismissAll();
				let cadastro = "google";
				this.navCtrl.push(EditPerfilPage, {cadastro});
			}
			else{
				this.loading.dismissAll();
			}
			
			}); 		
			
			/*if(result.additionalUserInfo.isNewUser == true){
				let cadastro = "google";
				this.navCtrl.push(EditPerfilPage, {cadastro});
			}
			else{
				this.navCtrl.setRoot(HomePage);
			}*/
		}	
	})	
	.catch((e) => {
		var ref = firebase.database().ref("usuarios/" + this.afAuth.auth.currentUser.uid)
		ref.once("value", (snapshot)=> {
		
		if(!snapshot.child("perfil").exists()){
			this.loading.dismissAll();
			let cadastro = "google";
			this.navCtrl.push(EditPerfilPage, {cadastro});
		}
		else{
			this.loading.dismissAll();
		}
			
			}); 
		
	})

	


}  

}

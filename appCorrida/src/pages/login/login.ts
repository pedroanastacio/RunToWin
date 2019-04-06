import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import { CadastroPage } from '../cadastro/cadastro';

import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
	loginError: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
		fb: FormBuilder) {

      this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(7)])]
		});
    }

    login() {
			let data = this.loginForm.value;
		
			if (!data.email) {
				return;
			}
		
			let credentials = {
				email: data.email,
				password: data.password
			};
			this.auth.signInWithEmail(credentials)
				.then(
					() => this.navCtrl.setRoot(HomePage),
					error => this.loginError = 'Não há registro de usuário correspondente a esse identificador. O usuário pode ter sido excluído.' 
				);
			}

  signup(){
  this.navCtrl.push(CadastroPage);
}

loginWithGoogle() {
	this.auth.signInWithGoogle()
	  .then(
		() => this.navCtrl.setRoot(HomePage),
		error => console.log(error.message)
	  );
  }

}

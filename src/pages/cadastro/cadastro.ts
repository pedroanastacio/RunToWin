import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { EditPerfilPage } from '../edit-perfil/edit-perfil';


@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
	signupError: string;
	form: FormGroup;

	constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, private auth: AuthService,
	private alertCtrl: AlertController) {
		this.form = fb.group({
				email: ['', Validators.compose([Validators.required, Validators.email])],
				password: ['', Validators.compose([Validators.required, Validators.minLength(7)])]
			});

  }

  signup() {
	  	let cadastro = "cadastro";
		let data = this.form.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		//this.auth.signUp(credentials).then(() => {this.navCtrl.push(EditPerfilPage);
		this.navCtrl.push(EditPerfilPage, {credentials, cadastro});
		/*})
		.catch((error:any) => {
			let alert = this.alertCtrl.create({
				title: 'Erro ao cadastrar',
				subTitle: 'Não foi possível realizar cadastro. Email pode estar mal formatado.',
				buttons: [{text: 'Ok',
									 cssClass: 'buttonAlert'
				}],
				cssClass: 'alertLogin'
			});
		alert.present();
		})*/
}

voltar(){
  this.navCtrl.pop();
}


}

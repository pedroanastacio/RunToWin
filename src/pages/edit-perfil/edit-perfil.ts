import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';



@IonicPage()
@Component({
  selector: 'page-edit-perfil',
  templateUrl: 'edit-perfil.html',
})
export class EditPerfilPage { 
  form: FormGroup;
  userperfil: any;
  altura: any;
  title: string;
  peso: any;
  sexo: any;

  cadastro: string = "editar";
  credentials: any;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private provider: UsuariosProvider,
  private toast: ToastController, public afAuth: AngularFireAuth, public navParams: NavParams,
  private auth: AuthService, private alertCtrl: AlertController) {
     
    this.userperfil = this.navParams.data.userperfil || {};
    this.createForm();

    this.setupPageTitle();
    this.cadastro = this.navParams.data.cadastro;

    if(this.cadastro != "editar"){
      let alert = this.alertCtrl.create({
				title: 'Cadastro de perfil',
				subTitle: 'Por favor, cadastre seu perfil.',
				buttons: [{text: 'Ok',
									 cssClass: 'buttonAlert'
				}],
				cssClass: 'alertLogin'
			});
		  alert.present();
    }
  }

    private setupPageTitle() {
      this.title = this.navParams.data.userperfil ? 'Alterando perfil' : 'Perfil';
    }
  
  
    createForm() {
      this.form = this.formBuilder.group({
        key: [this.userperfil.key],
        name: [this.userperfil.name, Validators.required],
        sexo: [this.userperfil.sexo, Validators.required],
        altura: [this.userperfil.altura, Validators.required],
        peso: [this.userperfil.peso, Validators.required],
        
      });
    }
  
    editarPerfil() {
      if (this.form.valid) {
        this.provider.save(this.form.value)
          .then(() => {
            this.provider.saveUserId(this.afAuth.auth.currentUser.uid);
            this.toast.create({ message: 'Perfil atualizado com sucesso.', duration: 3000 }).present();
            if(this.cadastro == "editar"){
               this.navCtrl.pop();
            }
            else{
              this.navCtrl.setRoot(HomePage);
            }   
          })
          .catch((e) => {
            this.toast.create({ message: 'Erro ao atualizar perfil.', duration: 3000 }).present();
            console.error(e);
          })
      }
  }

  editarPerfilCad() {
    this.credentials = this.navParams.data.credentials;
    console.log(this.credentials)
    if (this.form.valid) {
      this.auth.signUp(this.credentials).then(() => {
        this.auth.signInWithEmail(this.credentials).then(() => {
            this.provider.save(this.form.value).then(() => {
              this.provider.saveUserId(this.afAuth.auth.currentUser.uid);
              this.provider.createTotalDistance();
              this.toast.create({ message: 'Perfil atualizado com sucesso.', duration: 3000 }).present();
              if(this.cadastro == "cadastro"){
                this.navCtrl.pop();
              }
              else{
                setTimeout(()=> {
                  this.navCtrl.setRoot(HomePage);
                }, 4000)
                
              }
          })  
       
      })
    }).catch((error:any) => {
      let alert = this.alertCtrl.create({
				title: 'Erro ao cadastrar',
				subTitle: 'Não foi possível realizar cadastro. Email pode estar mal formatado.',
				buttons: [{text: 'Ok',
									 cssClass: 'buttonAlert'
				}],
				cssClass: 'alertLogin'
			});
		  alert.present();
      })
    }
  } 

  editarPerfilGoogle() {
    if (this.form.valid) {
      this.provider.save(this.form.value)
        .then(() => {
          this.provider.saveUserId(this.afAuth.auth.currentUser.uid);
          this.provider.createTotalDistance();
          this.toast.create({ message: 'Perfil atualizado com sucesso.', duration: 3000 }).present();
          if(this.cadastro == "google"){
             this.navCtrl.pop();
          }
          else{
            setTimeout(()=> {
              this.navCtrl.setRoot(HomePage);
            }, 4000)
          }   
        })
        .catch((e) => {
          this.toast.create({ message: 'Erro ao atualizar perfil.', duration: 3000 }).present();
          console.error(e);
        })
    }
}

}

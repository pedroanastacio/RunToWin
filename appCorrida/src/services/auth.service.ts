import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import AuthProvider = firebase.auth.AuthProvider;
import { AngularFireDatabaseModule, AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthService {
	private user: firebase.User;
	
	constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, private googlePlus: GooglePlus,
		public platform: Platform) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
				
	}

	signInWithEmail(credentials) {
		console.log('Entre com email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

  signUp(credentials) {
	return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	get authenticated(): boolean {
		return this.user !== null;
	  }

	getEmail() {
		return this.user && this.user.email;
	  }

	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
		}

		signInWithGoogle() {
			return this.googlePlus.login({
				'webClientId': '987803190423-6mkrptbift4nj840sfgfrfn3pjvtugn4.apps.googleusercontent.com',
				'offline': true
				})
				.then(res => {
					return this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
					.then((user: firebase.User) => {
						// atualizando o profile do usuario
						return user.updateProfile({ displayName: res.displayName, photoURL: res.imageUrl });
						
						});
	
				})
				.catch((e) => {
					console.log('Sign in with google');
					return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
				})
			}
				
			
	
		signOutGoogle() {
			if (this.afAuth.auth.currentUser.providerData.length) {
				for (var i = 0; i < this.afAuth.auth.currentUser.providerData.length; i++) {
				var provider = this.afAuth.auth.currentUser.providerData[i];
		
				if (provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID) { // Se for o gooogle
					// o disconnect limpa o oAuth token e tambem esquece qual conta foi selecionada para o login
					return this.googlePlus.disconnect()
					.then(() => {
						return this.signOut();
					}); 
				}
			}
		}
					return this.signOut();
				}
		
	private oauthSignIn(provider: AuthProvider) {
			if (!(<any>window).cordova) {
				return this.afAuth.auth.signInWithPopup(provider);
			}
	}

}

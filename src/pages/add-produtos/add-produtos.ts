import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProdutosProvider } from '../../providers/produtos/produtos';


@IonicPage()
@Component({
  selector: 'page-add-produtos',
  templateUrl: 'add-produtos.html',
})
export class AddProdutosPage { 
  form: FormGroup;
  produto: any;
  precoDesconto: number
  precoDescontoReais: number;
  preco: number;
  porcentagem: number;
  kmPoints: number;

  imgPath: string;
  fileToUpload: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: ProdutosProvider, 
  private formBuilder: FormBuilder, private toast: ToastController) {
    this.produto = this.navParams.data.produto || {};
    this.createFormProduto();
  }

  calcDesconto(){
    this.precoDesconto = this.preco - (this.preco * (this.porcentagem/100));
    this.precoDescontoReais = parseFloat(this.precoDesconto.toFixed(2));
    this.calcKmPoints();
  }

  calcKmPoints(){
    this.kmPoints = Number(((this.preco * this.porcentagem)/35).toFixed(0));
    if (this.kmPoints < 1){
      this.kmPoints = 1;
    }  
  }

  createFormProduto() { 
    this.form = this.formBuilder.group({
      key: [this.produto.key],
      nomeProduto: [this.produto.nomeProduto, Validators.required],
      preco: [this.produto.preco, Validators.required],
      porcentagem: [this.produto.porcentagem, Validators.required],
      sexo: [this.produto.sexo, Validators.required],
      categoria: [this.produto.categoria, Validators.required],
      marca: [this.produto.marca, Validators.required],
      tamanho: [this.produto.tamanho, Validators.required],
      loja: [this.produto.loja, Validators.required ]
    });
  }

  editarProduto() {
    if (this.form.valid) {
      this.provider.save(this.form.value, this.precoDescontoReais, this.kmPoints)
        .then(() => {
          this.toast.create({ message: 'Produto cadastrado com sucesso.', duration: 3000 }).present();
          this.navCtrl.push('HomePage');
        })
        .catch((e) => {
          this.toast.create({ message: 'Erro ao cadastrar produto.', duration: 3000 }).present();
          console.error(e);
        })
    }
  }

 

}

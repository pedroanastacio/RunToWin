import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import * as _ from 'lodash';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingController } from 'ionic-angular';
import { ShowProdutoPage } from '../show-produto/show-produto';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {
  @ViewChild(Content) content: Content;

  listaProdutos: any;
  filteredProdutos: any;

  filtro: any;
  categoria: string;
  sexo: string;
  marca: string;
  loja: string;
  preco: number;
  kmPoints: number;
  min: number;
  max: number;
  porcentagem: string;

  filters = {}
  filtros: string = "";
  filtrosParc: string = "";
  filtroCategoria: boolean = false;
  filtroMarca: boolean = false;
  filtroDesconto: boolean = false;
  filtroLoja: boolean = false;
  filtroPreco: boolean = false;
  filtroKmPoints: boolean = false;

  property: any;
  loading: any;
     
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase,
  public loadingController:LoadingController) {
    
   }

  ionViewDidLoad(){
    //this.produtos = this.provider.getAll();
    this.listarProdutos();

  }

  listarProdutos(){
    this.loading = this.loadingController.create({ content: "Carregando cupons..." });
    this.loading.present();
    this.db.list('produtos/').valueChanges()
      .subscribe(listaProdutos => {
        this.listaProdutos = listaProdutos;
        this.applyFilters()
        this.loading.dismissAll();
    })
  }

  applyFilters() {
    this.filteredProdutos = _.filter(this.listaProdutos, _.conforms(this.filters) )
    
  }

  filterExact(property: string, rule: any) {
    if(this.property == property && property == "Desconto"){
      this.filtros = this.filtrosParc + rule + "%" + " / ";
    }
    else if(this.property == property){
      this.filtros = this.filtrosParc + rule + " / ";
    }
    else if(property == "Desconto"){
      this.filtrosParc = this.filtros;
      this.filtros = this.filtros + rule + "%" + " / ";
    }
    else{
      this.filtrosParc = this.filtros;
      this.filtros = this.filtros + rule + " / ";
    }

    this.property = property;
    this.filters[this.property] = val => val == rule
    this.applyFilters()
    

    if(this.property == "Categoria"){
      this.filtroCategoria = true;
    }
    else if(this.property == "Marca"){
      this.filtroMarca = true;
    }
   else if(this.property == "Loja"){
      this.filtroLoja = true;
    }
   else if(this.property == "Desconto"){
      this.filtroDesconto = true;
    }
  }

  /// filter  numbers greater than rule
  filterGreaterThan(property: string, min:number, max: number) {
    
    if(this.property == property && property == "PrecoDesconto"){
      this.filtros = this.filtrosParc + "R$" + min + "-" +  "R$" + max + " / ";
    }
    else if(this.property == property && property == "KmPoints"){
      this.filtros = this.filtrosParc + min + "Km" + "-" + max + "Km" + " / ";
    }
    else if(property == 'PrecoDesconto'){
      this.filtrosParc = this.filtros;
      this.filtros = this.filtros + "R$" + min + "-" +  "R$" + max + " / ";
    }
    else if(property == 'KmPoints'){
      this.filtrosParc = this.filtros;
      this.filtros = this.filtros + min + "Km" + "-" + max + "Km" + " / ";
    }

    this.property = property;
    this.filters[this.property] = val => val >= min && val <= max;

    if(property == 'PrecoDesconto'){
      this.db.list('produtos/', ref => ref.orderByChild('PrecoDesconto')).valueChanges()
        .subscribe(listaProdutos => {
          this.listaProdutos = listaProdutos;
          this.applyFilters()
          
      })
    }
    else if(property == 'KmPoints'){
      this.db.list('produtos/', ref => ref.orderByChild('KmPoints')).valueChanges()
        .subscribe(listaProdutos => {
          this.listaProdutos = listaProdutos;
          this.applyFilters()
          
      })
    }
    
    if(this.property == "PrecoDesconto"){
      this.filtroPreco = true;
    }
    else if(this.property == "KmPoints"){
      this.filtroKmPoints = true;
    }
    
  }

    /// filter properties that resolve to true
  filterBoolean(property: string, rule: boolean) {
    this.property = property;
    if (!rule) this.removeFilter(this.property)
    else {
      this.filters[this.property] = val => val
      this.applyFilters()
      
    }
  }

  /// removes filter
  removeFilter(property: string) {
    this.loading = this.loadingController.create({ content: "Carregando cupons..." });
    this.loading.present();
    this.property = property;
    this.min = null;
    this.max = null;
    delete this.filters[this.property]
    this.filters = {};
    this.property = null;
    this.filtro = null;
    this.marca = null;
    this.categoria = null;
    this.sexo = null;
    this.loja = null;
    this.porcentagem = null;
    this.filtros = "";
    this.filtrosParc = "";
    this.filtroCategoria = false;
    this.filtroDesconto = false;
    this.filtroLoja = false;
    this.filtroPreco = false;
    this.filtroMarca = false;
    this.filtroKmPoints = false;

    this.db.list('produtos/').valueChanges()
      .subscribe(listaProdutos => {
        this.listaProdutos = listaProdutos;
        this.filteredProdutos = listaProdutos;
        this.loading.dismissAll();
    })
  }

  showProduto(key: any){
    this.navCtrl.push(ShowProdutoPage, {key});
  }
  

  scrollToTop() {
    this.content.scrollToTop();
  }

  scrollToBottom() {
    this.content.scrollToBottom();
  }

}

export class produtoModel {
    public nomeProdutoDB: String;
    public PrecoDB: String;
    public DescontoDB: String;
    public PrecoDescontoDB: Number;
    public SexoDB: String;
    public LojaDB: String;
    public TamanhoDB: Array<String>;
    public urlDB: String;
    public fullPathDB: String;
    public kmPointsDB: Number;
    public linkDB: String;
    public corDB: String;

    constructor(public nomeProduto: String, public Preco: String, public Desconto: String, public PrecoDesconto: Number,
    public Sexo: String, public Loja: String, public Tamanho: Array<String>, public url: String, public fullPath,
    public kmPoints: Number, public Link: String, public Cor: String){

        this.nomeProdutoDB = nomeProduto;
        this.PrecoDB = Preco;
        this.DescontoDB = Desconto;
        this.PrecoDescontoDB = PrecoDesconto;
        this.SexoDB = Sexo;
        this.LojaDB = Loja;
        this.TamanhoDB = Tamanho;
        this.urlDB = url;
        this.fullPathDB = fullPath;
        this.kmPointsDB = kmPoints;
        this.linkDB = Link;
        this.corDB = Cor;
    }

   
} 
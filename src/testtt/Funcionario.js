export default class Funcionario {
    matricula: int;
    nome: string;
    data_de_nascimento: int;
    telefone_celular: string;
    email: string;
    is_editable: false;
    sexo: int;
    lotacao: int;
    cargo: int;
    estadoCivil: int;
    estadoNascimento: int;
    municipioNascimento: int;

    constructor(
        matricula=0,
        nome="",
        data_de_nascimento="",
        telefone_celular="",
        email="",
        is_editable=true,
        sexo=0,
        lotacao=0,
        cargo:0,
        estadoCivil:0,
        estadoNascimento:0,
        municipioNascimento:0,
    ){
        this.matricula=matricula,
        this.nome=nome,
        this.data_de_nascimento=data_de_nascimento,
        this.telefone_celular=telefone_celular,
        this.email=email,
        this.is_editable=is_editable,
        this.sexo=sexo,
        this.lotacao=lotacao,
        this.cargo=cargo,
        this.estadoCivil=estadoCivil,
        this.estadoNascimento=estadoNascimento,
        this.municipioNascimento=municipioNascimento
    }
}
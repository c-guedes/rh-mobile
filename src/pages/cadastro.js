import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '../services/api'
import Input from '../components/Input';
import Funcionario from '../testtt/Funcionario'
import { TextInputMask } from 'react-native-masked-text'

export default class Main extends Component {
    static navigationOptions = {
        title: "Cadastro"
    }

    constructor(props) {
        super(props);
        this.state = {
            typedText: '',
            estados: [],
            municipios: [],
            cargos: [],
            lotacoes: [],
            estadoCivil: [],
            funcionario: new Funcionario(),
            loading: false,
        };
    }

    componentDidMount() {
        this.loadEstadoCivil();
        this.loadEstados();
        this.loadLotacao();
    }

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        console.warn("aaa");
        params.getData();
    }

    loadMunicipios = async (estadoId) => { // arrow ele herda o escopo acima
        await api.get('getMunicipios/' + estadoId)
            .then(response => {
                const teste = response.data;
                this.setState({ municipios: teste[0].municipios })
                this.setState({ selectedMunicipioIndex: -1 })

            })
            .catch(error => {
                (error)
            })
    };

    loadEstadoCivil = async () => { // arrow ele herda o escopo acima
        await api.get('getEstadoCivil/')
            .then(response => {
                const teste = response.data;
                console.log(teste)
                this.setState({ estadoCivil: teste })
            })
            .catch(error => {
                (error)
            })
    };

    loadEstados = async () => { // arrow ele herda o escopo acima
        await api.get('estados')
            .then(response => {
                const teste = response.data;
                this.setState({ estados: teste })

            })
            .catch(error => {
                console.log(error)
            })
    };

    loadLotacao = async () => { // arrow ele herda o escopo acima
        await api.get('lotacao')
            .then(response => {
                const teste = response.data;
                this.setState({ lotacoes: teste })
            })
            .catch(error => {
                console.log(error)
            })
    };

    loadCargos = async (idLotacao) => { // arrow ele herda o escopo acima
        this.setState({ loading: true })
        await api.get('lotacao_cargo/' + idLotacao)
            .then(response => {
                console.log(response)
                const teste = response.data;
                this.setState({ cargos: teste[0].cargos })
                this.setState({ selectedCargo: -1 })
            })
            .catch(error => {
                console.log(error)
            })
        this.setState({ loading: false })
    };

    showAlert(responseText) {
        if (responseText == "200") {
            Alert.alert(
                'Sucesso',
                "Usuário alterado com sucesso!",
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Oops!',
                "Algo deu errado " + responseText,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }

    createFuncionario = async () => {
        try {
            const response = await api.post('new_funcionario/', this.state.funcionario)
            const teste = response.status;
            this.showAlert(teste.toString())
        } catch (error) {
            console.log(error.response.status)
            const teste = error.response.status
            this.showAlert(teste.toString())
        }
    }

    renderLoading() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    rearrangeDate(date){
        const res = date.split('/')
        return res[2]+"-"+res[1]+"-"+res[0]
    }

    render() {
        const { isValid } = this.state;
        console.log('isValid', isValid);

        return (
            <View
                style={styles.container}
            >
                {this.state.loading ? this.renderLoading() : null}
                <KeyboardAwareScrollView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={styles.form}>
                    <Text style={styles.headInputLeft}>Nome do funcionário</Text>
                    <Input style={styles.teste}
                        label="AAAAAAAAA"
                        placeholder="Insira o nome do funcionário"
                        pattern={[
                            '^[^!-\\/:-@\\[-`{-~]+$',
                        ]}
                        onValidation={isValid => this.setState({ isValid })}
                        onChangeText={
                            (textName) => {
                                this.state.funcionario.nome = textName
                            }
                        }
                    />
                    <View style={styles.sided}>
                        <Text style={styles.headInputLeft}>Número de matrícula</Text>
                        <Text style={styles.headInputRight}>Data de nascimento</Text>
                    </View>
                    <View style={styles.sided}>
                        <TextInput style={styles.teste}
                            placeholder="Insira o número de matricula"
                            keyboardType="numeric"
                            onChangeText={
                                (textMatricula) => {
                                    this.state.funcionario.matricula = textMatricula
                                }
                            }
                        />
                        <TextInputMask style={styles.teste}
                          type={'custom'}
                          options={{
                            mask: '99/99/9999'
                          }}
                            value={this.state.textNascimentoVal}
                            placeholder="10/12/2019"
                            keyboardType='numeric'
                            onChangeText={
                                (textNascimento) => {
                                    this.setState({
                                        textNascimentoVal: textNascimento
                                      })
                                    this.state.funcionario.data_de_nascimento = textNascimento
                                }
                            }
                        />
                    </View>
                    <View style={styles.sided}>
                        <Text style={styles.headInputLeft}>Número de celular</Text>
                        <Text style={styles.headInputRight}>Email</Text>
                    </View>
                    <View style={styles.sided}>
                        <TextInputMask style={styles.teste}
                            type={'cel-phone'}
                            options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                            }}
                            value={this.state.international}
                            placeholder="(00) 00000-0000"
                            onChangeText={
                                (textCelular) => {
                                    this.setState({
                                        international: textCelular
                                      })
                                    this.state.funcionario.telefone_celular = textCelular
                                }
                            }
                        />

                        <TextInput style={styles.teste}
                            placeholder="example@bb.com"
                            onChangeText={
                                (textEmail) => {
                                    this.state.funcionario.email = textEmail
                                }
                            }
                        />
                    </View>
                    <Picker
                        iosHeader="Estado civil"
                        mode="dropdown"
                        selectedValue={this.state.civil}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ civil: itemValue })
                            this.state.funcionario.estadoCivil = itemValue
                        }

                        }>
                        <Picker.Item label="Estado civil" color='gray' />
                        {this.state.estadoCivil.map((item, index) => {
                            return (<Picker.Item label={item.estadoCivil} value={item.id} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Sexo"
                        mode="dropdown"
                        selectedValue={this.state.language}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ language: itemValue })
                            this.state.funcionario.sexo = itemValue + 1
                        }

                        }>
                        <Picker.Item label="Selecione o sexo" color='gray' />
                        {sex.map((item, index) => {
                            return (<Picker.Item label={item} value={index} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Lotação"
                        mode="dropdown"
                        selectedValue={this.state.tt}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex != 0) {
                                this.setState({ tt: itemValue })
                                this.state.funcionario.lotacao = itemValue
                                this.loadCargos(itemValue)

                            }
                        }
                        }>
                        <Picker.Item label="Selecione uma lotação" color='gray' />
                        {this.state.lotacoes.map((item, index) => {
                            return (<Picker.Item label={item.lotacao} value={item.id} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Cargo"
                        mode="dropdown"
                        selectedValue={this.state.selectedCargo}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex != 0) {
                                this.setState({ selectedCargo: itemValue })
                                this.state.funcionario.cargo = itemValue
                                console.log(itemValue)
                            }
                        }
                        }>
                        <Picker.Item label="Selecione um cargo" value={null} color='gray' />
                        {this.state.cargos.map((item, index) => {

                            return (<Picker.Item label={item.cargo} value={item.id} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Estado de Nascimento"
                        mode="dropdown"
                        selectedValue={this.state.estadoNasc}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex != 0) {
                                this.setState({ estadoNasc: itemValue })
                                this.state.funcionario.estadoNascimento = itemValue
                                this.loadMunicipios(itemValue)

                            }
                        }
                        }>
                        <Picker.Item label="Estado de Nascimento" color='gray' />
                        {this.state.estados.map((item, index) => {
                            return (<Picker.Item label={item.estado} value={item.id} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Cidade de Nascimento"
                        mode="dropdown"
                        selectedValue={this.state.selectedMunicipioIndex}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex != 0) {
                                this.state.funcionario.municipioNascimento = itemValue
                                this.setState({ selectedMunicipioIndex: itemValue })
                            }
                        }
                        }>
                        <Picker.Item label="Cidade de Nascimento" color='gray' />
                        {this.state.municipios.map((item, index) => {
                            return (<Picker.Item label={item.municipio} value={item.id} key={index} color='black' />)
                        })}
                    </Picker>

                    <Text>{this.state.typedText}</Text>

                </KeyboardAwareScrollView>

                <TouchableOpacity style={styles.bottom}
                    onPress={() => {
                        //this.props.navigation.navigate("Profile")

                        this.state.funcionario.data_de_nascimento = this.rearrangeDate(this.state.funcionario.data_de_nascimento)
                        this.createFuncionario()
                        console.log(this.state.funcionario)
                    }}
                >
                    <Text style={styles.btnText}>CADASTRAR</Text>
                </TouchableOpacity>
                {/* 
                <View style={styles.bottom}>

                </View> */}
            </View >
        );
    }
};


var sex = ["Masculino", "Feminino"];

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    form: {
        flex: 0,
        marginTop: 20,
        marginEnd: 20,
        marginStart: 20,
    },
    teste: {
        flex: 1,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    },
    sexPicker: {
        flex: 1,
        marginStart: 10,
        height: 50,
        width: '100%'
    },
    helpText: {
        marginStart: 10
    },
    bottom: {
        flex: 1,
        width: '100%',
        height: 45,
        backgroundColor: '#2ecc71',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    buttonz: {
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        padding: 10
    },
    btnText: {
        color: "#FFF",
        fontSize: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "200",
        textAlign: 'center',
        marginTop: 20,
    },
    sided: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headInputLeft: {
        flex: 1,
        marginStart: 20
    },
    headInputRight: {
        flex: 1,
        marginStart: 20,
        alignContent: "flex-start",
    },
    load: {
        flex: 1,
        justifyContent: 'center'
    }
})

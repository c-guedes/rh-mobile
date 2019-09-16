import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Picker, TouchableOpacity, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '../services/api'
import Funcionario from '../testtt/Funcionario'
import { TextInputMask } from 'react-native-masked-text'



export default class Main extends Component {
    static navigationOptions = {
        title: "Atualizar informações"
    }

    constructor(props) {
        super(props);
        this.state = {
            teste: [],
            typedText: '',
            estados: [],
            municipios: [],
            cargos: [],
            lotacoes: [],
            estadoCivil: [],
            selectedCargo: 0,
            selectedMunicipioIndex: 0,
            funcionario: new Funcionario(),
            loading: false,
        };
    }

    componentDidMount() {
        this.loadEstadoCivil();
        this.loadEstados();
        this.loadLotacao();
    }

    loadMunicipios = async (estadoId) => { // arrow ele herda o escopo acima
        this.setState({ selectedMunicipioIndex: 0 })
        await api.get('getMunicipios/' + estadoId)
            .then(response => {
                const teste = response.data;
                this.setState({ municipios: teste[0].municipios })


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
        this.setState({ selectedCargo: 0 })
        await api.get('lotacao_cargo/' + idLotacao)
            .then(response => {
                console.log(response)
                const teste = response.data;
                this.setState({ cargos: teste[0].cargos })
            })
            .catch(error => {
                console.log(error)
            })
        this.setState({ loading: false })
    };

    rearrangeDate(date) {
        if (date.includes('-')) {
            const res = date.split('-')
            return res[2] + "/" + res[1] + "/" + res[0]
        } else {
            const res = date.split('/')
            return res[2] + "-" + res[1] + "-" + res[0]
        }
    }

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
    alterFuncionario = async (obj, matricula) => {
        console.log(obj)
        try {
            const response = await api.put('funcionario/update-partial/' + matricula + "/", obj)
            const teste = response.status;
            this.showAlert(teste.toString())
        } catch (error) {
            console.log(error.response)
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

    componentWillUnmount() {
        const { params } = this.props.navigation.state;
        params.getData();
    }


    render() {
        const funcionarioData = this.props.navigation.state.params.item
        return (

            <View
                style={styles.container}
            >

                {this.state.loading ? this.renderLoading() : null}
                <KeyboardAwareScrollView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={styles.form}>
                    <Text style={styles.headInputLeft}>Nome do funcionário</Text>
                    <TextInput style={styles.teste}
                        label="AAAAAAAAA"
                        placeholder={funcionarioData.nome}

                        onChangeText={
                            (textName) => {
                                composeFuncionario["nome"] = textName
                            }
                        }
                    />
                    <View style={styles.sided}>
                        <Text style={styles.headInputLeft}>Número de matrícula</Text>
                        <Text style={styles.headInputRight}>Data de nascimento</Text>
                    </View>
                    <View style={styles.sided}>
                        <TextInput style={styles.teste}
                            placeholder={funcionarioData.matricula}
                            keyboardType="numeric"
                            onChangeText={
                                (textMatricula) => {
                                    composeFuncionario["matricula"] = textMatricula
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
                            placeholder={this.rearrangeDate(funcionarioData.data_de_nascimento)}
                            keyboardType='numeric'
                            onChangeText={
                                (textNascimento) => {
                                    this.setState({
                                        textNascimentoVal: textNascimento
                                      })
                                    composeFuncionario["data_de_nascimento"] = this.rearrangeDate(textNascimento)
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
                            placeholder={funcionarioData.telefone_celular}
                            onChangeText={
                                (textCelular) => {
                                    this.setState({
                                        international: textCelular
                                    })
                                    composeFuncionario[" telefone_celular"] = textCelular
                                }
                            }
                        />

                        <TextInput style={styles.teste}
                            placeholder={funcionarioData.email}
                            onChangeText={
                                (textEmail) => {
                                    composeFuncionario["email"] = textEmail
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
                            composeFuncionario["estadoCivil"] = itemValue
                        }

                        }>
                        <Picker.Item label={funcionarioData.estadoCivil} color='gray' />

                        {this.state.estadoCivil.map((item, index) => {
                            return (<Picker.Item label={item.estadoCivil} value={item.estadoCivil} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Sexo"
                        mode="dropdown"
                        selectedValue={this.state.language}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ language: itemValue })

                            composeFuncionario["sexo"] = itemValue
                        }

                        }>
                        <Picker.Item label={funcionarioData.sexo} color='gray' />
                        {sex.map((item, index) => {
                            return (<Picker.Item label={item} value={item} key={index} color='black' />)
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
                                composeFuncionario["lotacao"] = itemValue
                                this.loadCargos(itemIndex)
                            }
                        }
                        }>
                        <Picker.Item label={funcionarioData.lotacao} color='gray' />
                        {this.state.lotacoes.map((item, index) => {
                            return (<Picker.Item label={item.lotacao} value={item.lotacao} key={index} color='black' />)
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
                                composeFuncionario["cargo"] = itemValue
                            }
                        }
                        }>
                        <Picker.Item label={funcionarioData.cargo} value={null} color='gray' />
                        {this.state.cargos.map((item, index) => {

                            return (<Picker.Item label={item.cargo} value={item.cargo} key={index} color='black' />)
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
                                this.loadMunicipios(itemIndex)
                                composeFuncionario["estadoNascimento"] = itemValue
                            }
                        }
                        }>
                        <Picker.Item label={funcionarioData.estadoNascimento} color='gray' />
                        {this.state.estados.map((item, index) => {
                            return (<Picker.Item label={item.estado} value={item.estado} key={index} color='black' />)
                        })}
                    </Picker>
                    <Picker
                        iosHeader="Cidade de Nascimento"
                        mode="dropdown"
                        selectedValue={this.state.selectedMunicipioIndex}
                        style={styles.sexPicker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemIndex != 0) {
                                this.setState({ selectedMunicipioIndex: itemValue })
                                composeFuncionario["municipioNascimento"] = itemValue
                            }
                        }
                        }>
                        <Picker.Item label={funcionarioData.municipioNascimento} color='gray' />
                        {this.state.municipios.map((item, index) => {
                            return (<Picker.Item label={item.municipio} value={item.municipio} key={index} color='black' />)
                        })}
                    </Picker>

                    <Text>{this.state.typedText}</Text>

                </KeyboardAwareScrollView>

                <TouchableOpacity style={styles.bottom}
                    onPress={() => {
                        //this.props.navigation.navigate("Profile")
                        this.alterFuncionario(composeFuncionario, funcionarioData.matricula)
                    }}
                >
                    <Text style={styles.btnText}>ATUALIZAR</Text>
                </TouchableOpacity>
                {/* 
                <View style={styles.bottom}>

                </View> */}
            </View >
        );
    }
};


var sex = ["Masculino", "Feminino"];
var composeFuncionario = {}

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
        padding: 10,
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
import React, { Component } from 'react';
import api from '../services/api'
import { View, Text, TextInput, StyleSheet, Picker, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';


export default class Home extends Component {
    static navigationOptions = {
        title: "RH Desafio"
    }

    constructor() {
        super();
        this.state = {
            filtersOn: [],
            funcionarios: [],
            data: [],
            cargos: [],
            lotacoes: [],
            loading: false,
            text: '',
            show: true,
            expanded: false,
            ButtonStateHolder: true
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount() {
        this.loadFuncionarios();
        this.loadLotacao();
        //this.loadCargos();
    }

    loadFuncionarios = async () => { // arrow ele herda o escopo acima
        try {
            const response = await api.get('funcionarios');
            const teste = response.data;
            this.setState({ funcionarios: teste })
            this.setState({ data: teste })
            console.log(funcionarios)

        } catch (erro) {
            console.log("Erro nos funcionarios")
        }

    };

    loadLotacao = async () => { // arrow ele herda o escopo acima
        await api.get('/lotacao')
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
        await api.get('/lotacao_cargo/' + idLotacao)
            .then(response => {
                const teste = response.data;
                this.setState({ cargos: teste[0].cargos })
                this.setState({ selectedCargo: 0 })
            })
            .catch(error => {
                console.log(error)
            })
        this.setState({ loading: false })
    };


    deleteFuncionario = async (matricula) => { // arrow ele herda o escopo acima
        try {
            const response = await api.delete('delete_funcionario/' + matricula)
            const teste = response.status;
            this.showAlert(teste.toString())
            this.loadFuncionarios()
        } catch (error) {
            console.log(error.response)
            const teste = error.response.status
            this.showAlert(teste.toString())
        }
    };

    showConfirmDelete(matricula) {
        Alert.alert(
            'Deseja excluir?',
            matricula,
            [
                { text: 'Cancelar', onPress: () => console.log('Cancelar') },
                { text: 'Excluir', onPress: () => this.deleteFuncionario(matricula) },
            ],
            { cancelable: false },
        );
    }

    showAlert(responseText) {
        Alert.alert(
            'Response',
            responseText,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }



    handleSearch = text => {
        if (text != '') {
            const newData = this.state.funcionarios.filter(function (item) {
                const itemData = item.nome.toUpperCase()
                const txtData = text.toUpperCase()
                return itemData.indexOf(txtData) > -1;
            })
            this.setState({ funcionarios: newData })
        } else {
            this.setState({ funcionarios: this.state.data })
        }
    };

    withFilter = () => {
        const newData = this.state.data.filter(function (item) {
            const itemData = item.cargo.toUpperCase()
            if (item.cargo.toUpperCase() == dictFilter.cargo[0].toUpperCase()
                && item.lotacao.toUpperCase() == dictFilter.lotacao[0].toUpperCase()
                && item.sexo.toUpperCase() == dictFilter.sex[0].toUpperCase()) {
                return itemData.indexOf(dictFilter.cargo[0].toUpperCase()) > -1;
            } else if (item.cargo.toUpperCase() == dictFilter.cargo[0].toUpperCase()
                && item.lotacao.toUpperCase() == dictFilter.lotacao[0].toUpperCase()) {
                return itemData.indexOf(dictFilter.lotacao[0].toUpperCase()) > -1;
            } else if (item.cargo.toUpperCase() == dictFilter.cargo[0].toUpperCase() &&
                item.sexo.toUpperCase() == dictFilter.sex[0].toUpperCase()) {
                return itemData.indexOf(dictFilter.sex[0].toUpperCase()) > -1;
            } else if (item.lotacao.toUpperCase() == dictFilter.lotacao[0].toUpperCase()) {
                return itemData.indexOf(dictFilter.lotacao[0].toUpperCase()) > -1;
            } else {
                return itemData.indexOf(dictFilter.sex[0].toUpperCase()) > -1;
            }
        })
        this.setState({ funcionarios: newData })
    };

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ funcionarios: this.state.data })
        this.setState({ expanded: !this.state.expanded });
    }

    rearrangeDate(date) {
        const res = date.split('-')
        return res[2] + "/" + res[1] + "/" + res[0]
    }

    renderItem = ({ item }) => (
        

        <View style={styles.productContainer}>
            <Text style={styles.contentTitle}>{item.nome}</Text>
            <Text style={styles.contentDescription}>
                Matricula: {item.matricula}{"\n"}
                Data de nascimento: {this.rearrangeDate(item.data_de_nascimento)}{"\n"}
                Sexo: {item.sexo}{"\n"}
                Lotação: {item.lotacao}{"\n"}
                Cargo: {item.cargo}{"\n"}
            </Text>
            <View style={styles.sideOf}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => this.props.navigation.navigate("DetailFunc", { item, getData: this.loadFuncionarios.bind(this) })}
                >
                    <Text style={styles.opText}>Visualizar</Text>
                </TouchableOpacity>
                {item.is_editable ? (
                    <TouchableOpacity
                        disabled={!item.is_editable}
                        style={styles.editBtn} zx
                        onPress={() => this.props.navigation.navigate("UpdateFunc", { item, getData: this.loadFuncionarios.bind(this) })}
                    >
                        <Text style={styles.opText}>Editar</Text>
                    </TouchableOpacity>
                ) : <TouchableOpacity
                    disabled={true}
                    style={styles.editBtnDisabled} zx
                    onPress={() => this.props.navigation.navigate("UpdateFunc", { item, getData: this.loadFuncionarios.bind(this) })}
                >
                        <Text style={styles.opText}>Editar</Text>
                    </TouchableOpacity>}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.showConfirmDelete(item.matricula)}
                >
                    <Text style={styles.opText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    knowExpanded() {
        dictFilter.clear();
        return btnName[this.state.expanded ? 1 : 0]
    }


    showHideComponent = () => {
        if (this.state.show == true) {
            this.setState({ show: false })
            this.changeLayout()
        } else {
            this.setState({ show: true })
            this.changeLayout()
        }
    };
    render() {
        const { navigate } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.containerSearch}>

                    {this.state.show ? (
                        <View style={styles.searchSection}>
                            <TextInput
                                inlineImageLeft='search1'
                                paddingLeft={50}
                                style={styles.input}
                                placeholder="Digite um nome..."
                                onChangeText={(text) => this.handleSearch(text)} />
                            <Icon name="search1" style={styles.searchIcon} size={30} color="#999" />
                        </View>
                    ) : null}
                    <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
                        <Picker
                            iosHeader="Sexo"
                            mode="dropdown"
                            selectedValue={this.state.language}
                            style={styles.sexPicker}
                            onValueChange={(itemValue, itemIndex) => {
                                if (itemIndex != 0) {
                                    this.setState({ language: itemValue })
                                    dictFilter.sex[0] = sex[itemIndex - 1]
                                    this.withFilter()
                                }
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
                                    dictFilter.lotacao[0] = this.state.lotacoes[itemValue].lotacao
                                    this.loadCargos(itemIndex)
                                    this.withFilter()
                                }
                            }
                            }>
                            <Picker.Item label="Selecione uma lotação" value={null} color='gray' />
                            {this.state.lotacoes.map((item, index) => {
                                return (<Picker.Item label={item.lotacao} value={index} key={index} color='black' />)
                            })}
                        </Picker>
                        <Picker
                            iosHeader="Cargo"
                            enabled={!this.state.loading}
                            mode="dropdown"
                            selectedValue={this.state.selectedCargo}
                            style={styles.sexPicker}
                            onValueChange={(itemValue, itemIndex) => {
                                if (itemIndex != 0) {
                                    this.setState({ selectedCargo: itemValue })
                                    dictFilter.cargo[0] = this.state.cargos[itemValue].cargo
                                    tesst = 2
                                    this.withFilter()
                                }
                            }
                            }>
                            <Picker.Item label="Selecione um cargo" value={null} color='gray' />
                            {this.state.cargos.map((item, index) => {
                                return (<Picker.Item label={item.cargo} value={index} key={index} color='black' />)
                            })}
                        </Picker>
                    </View>
                    <TouchableOpacity onPress={this.showHideComponent} style={styles.filterBtn}>
                        <Text style={styles.textBtn}>{btnName[this.state.expanded ? 1 : 0]}</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    contentContainerStyle={styles.containerList}
                    data={this.state.funcionarios}
                    keyExtractor={item => item.matricula}
                    renderItem={this.renderItem}
                />
                {/* <Text>AA</Text>
                {this.state.docs.map(products =>(
                    <Text>{products.title}</Text>
                ))}
             */}
                <TouchableOpacity style={styles.floatButton}
                    onPress={() => {
                        this.props.navigation.navigate("Cadastro", { data: this.state.funcionarios, lotacoes: this.state.lotacoes, cargo: this.state.cargos, getData: this.loadFuncionarios.bind(this) })
                        // navigate("Cadastro", { data: this.state.funcionarios, lotacoes: this.state.lotacoes, cargo: this.state.cargos, getData: this.loadFuncionarios.bind(this) }
                        // )
                    }}
                >
                    <Icon name="adduser" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }
};

var sex = ["Masculino", "Feminino"];
var btnName = ["Habilitar filtro", "Desabilitar filtro"];
var dictFilter = { 'lotacao': ["Tecnologia da Informação"], 'cargo': ["Desenvolvedor"], 'sex': ["Masculino"] };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa"
    },
    floatButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 120,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#263238',
    },
    btnText: {
        color: "#004D40",
        fontSize: 20
    },
    bottom: {
        flex: 1,
        marginEnd: 20,
        marginStart: 20,
        justifyContent: 'flex-end',
        marginBottom: 36
    },
    containerList: {
        padding: 20
    },
    contentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",

    },
    contentDescription: {
        fontSize: 14,
        marginTop: 5,
        color: "#999",
        lineHeight: 24

    },
    productContainer: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        padding: 20,
        marginBottom: 10,
        borderRadius: 10
    },
    filterBtn: {
        height: 40,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        fontWeight: "bold",
        color: "#DA552F"
    },
    containerSearch: {
        flex: 0,
        marginTop: 25,
        backgroundColor: "#FFF",

    },
    searchHolder: {
        fontSize: 16,
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    text: {
        fontSize: 17,
        color: 'black',
        padding: 10
    },

    btnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    },

    btnTextHolder: {
        borderWidth: 1,
        borderColor: '#1A237E'
    },

    Btn: {
        padding: 10,
        backgroundColor: 'transparent'
    },
    ImageIconStyle: {
        padding: 5,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    sideOf: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editBtn: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#0091EA',
        borderColor: "#00B0FF",
        marginTop: 10,
        marginEnd: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtnDisabled: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'gray',
        borderColor: "gray",
        marginTop: 10,
        marginEnd: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#DA552F',
        borderColor: "#DA552F",
        marginTop: 10,
        marginEnd: 10,
        justifyContent: 'center',
        alignSelf: 'center',

    },
    opText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: "300"
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 20,
        marginStart: 20
    },
    searchIcon: {
        alignContent: "flex-end",
        padding: 10,
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        fontSize: 16,
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },

})
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';




export default class Main extends Component {
    static navigationOptions = {
        title: "Funcionario"
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    rearrangeDate(date) {
        const res = date.split('-')
        return res[2] + "/" + res[1] + "/" + res[0]
    }

    render() {
        const item = this.props.navigation.state.params.item
        return (
            <View style={styles.container}>
                <View style={styles.productContainer}>
                    <Text style={styles.contentTitle}>{item.nome}</Text>
                    <Text style={styles.contentDescription}>
                        Matricula: {item.matricula}{"\n"}
                        Data de nascimento: {this.rearrangeDate(item.data_de_nascimento)}{"\n"}
                        Sexo: {item.sexo}{"\n"}
                        Lotação: {item.lotacao}{"\n"}
                        Cargo: {item.cargo}{"\n"}
                        Estado de nascimento: {item.estadoNascimento}{"\n"}
                        Cidade de nascimento: {item.municipioNascimento}{"\n"}
                        Estado civil: {item.estadoCivil}{"\n"}
                        Número de celular: {item.telefone_celular}{"\n"}
                        Email: {item.email}{"\n"}
                        Editável? {item.is_editable.toString()} {"\n"}
                    </Text>
                </View>
            </View >
        );
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa"
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
})
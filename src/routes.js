  import {
    createStackNavigator
  } from 'react-navigation';

import Home from './pages/home';
import Cadastro from './pages/cadastro';
import UpdateFuncionario from './pages/updateFuncionario';
import DetailFunc from './pages/detailed';

export default createStackNavigator({
    Home: {screen: Home},
    Cadastro: {screen: Cadastro},
    UpdateFunc: {screen: UpdateFuncionario},
    DetailFunc: {screen: DetailFunc}
},{
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#263238"
        },
        headerTintColor: "#FFF"
    },
});

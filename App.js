import { Provider } from 'react-redux'
import store from './redux/store';
import Navigation from './navigation/stack';
import Toast from 'react-native-toast-message';
// import registerNNPushToken from 'native-notify';


export default function App() {
  // registerNNPushToken(20768, '4Z21kOS8VwGoxdAjOJaYc7');
  
  return (
    <Provider store={store}>
      <Navigation />
      <Toast />
    </Provider>
  );
}


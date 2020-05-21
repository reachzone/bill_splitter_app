import React, { useState, useContext, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { ErrorView, Container } from '../styled';
import { AuthContext } from '../context/AuthContext';
import ActivityLoader from '../components/ActivityLoader';
import { Button, Input } from 'react-native-elements';
const isWeb = Platform.OS === 'web';

const Login = ({ navigation }) => {
  const {
    state: { isLoading, isSignedIn, error },
    loginWithEmail,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viewError, setError] = useState(error);

  useEffect(() => {
    setError(error);
  }, [error]);

  const login = async () => {
    await loginWithEmail({ email, password });
  };
  return (
    <View>
      <ActivityLoader animating={isLoading && !isWeb} />
      {viewError && <ErrorView title={viewError} />}
      <Input onChangeText={setEmail} placeholder="Email" value={email} />
      <Input
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
      />
      <Button onPress={login} title={'Login'} />
    </View>
  );
};

export default Login;

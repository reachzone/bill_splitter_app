import React, { useState, useContext, useEffect } from 'react';
import { View, Platform } from 'react-native';
import Button from './components/Button';
import { Input, ErrorView } from './styled';
import { AuthContext } from './context/AuthContext';
import ActivityLoader from './components/ActivityLoader';
import { Redirect } from './router';
const isWeb = Platform.OS === 'web';

const Login = () => {
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
  if (isSignedIn) {
    return <Redirect to="/home" />;
  }
  const login = async () => {
    await loginWithEmail({ email, password });
  };
  return (
    <View>
      <ActivityLoader animating={isLoading && !isWeb} />
      {viewError && <ErrorView title={viewError}/>}
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

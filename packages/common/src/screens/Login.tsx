import React, { useState, useContext, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { ErrorView, Container } from '../styled';
import { AuthContext } from '../context/AuthContext';
import ActivityLoader from '../components/ActivityLoader';
import { Button, Input } from 'react-native-elements';
import validatejs from 'validate.js';

const isWeb = Platform.OS === 'web';

const Login = ({ navigation }) => {
  const {
    state: { isLoading, isSignedIn, error },
    loginWithEmail,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viewError, setError] = useState(error);
  const [formError, setFormError] = useState(null);

  var constraints = {
    email: {
      email: true,
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: 'must be at least 6 characters',
      },
    },
  };
  useEffect(() => {
    if (isSignedIn) {
      return navigation.navigate('Home');
    }
    setError(error);
  }, [error, isSignedIn]);

  const login = async () => {
    const validation = validatejs({ email, password }, constraints);
    if (Object.keys(validation || {}).length > 0) {
      setFormError(validation);
      return;
    }
    await loginWithEmail({ email, password });
  };
  return (
    <Container style={{ paddingHorizontal: 20 }}>
      <ActivityLoader animating={isLoading && !isWeb} />
      <View style={{ marginVertical: 20 }}>
        {viewError && <ErrorView title={viewError} />}
        <Input
          onFocus={() => {
            setError(null);
            setFormError(null);
          }}
          style={{ paddingHorizontal: 30 }}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          errorMessage={formError?.['email']?.[0] || ''}
        />
        <Input
          onFocus={() => {
            setError(null);
            setFormError(null);
          }}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          textContentType="password"
          value={password}
          errorMessage={formError?.['password']?.[0] || ''}
        />
      </View>
      <Button onPress={login} title={'Login'} />
    </Container>
  );
};

export default Login;

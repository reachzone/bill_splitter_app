import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, Button, Text, Divider } from 'react-native-elements';
import { ApiContext, AuthContext } from '../context';
import AddBillOverlay from './AddBillOverlay';
import { Bill } from '../api/types';
import { useLinkTo, Link } from '@react-navigation/native';
import ListEmptyState from '../components/ListEmptyState';

export default ({ navigation, route }) => {
  const params = route.params;
  const linkTo = useLinkTo();
  const [isShowingBill, setShowingBillOverly] = useState(false);

  const {
    state: { groups },
  } = useContext(ApiContext);
  const {
    state: { isSignedIn, userId },
  } = useContext(AuthContext);
  const group = groups.find((item) => item.id.toString() === params.id);
  const currentUser = userId;

  if (!group) {
    return null;
  }

  const addBill = async () => {
    setShowingBillOverly(!isShowingBill);
  };

  const keyExtractor = (_, index) => index.toString();

  const renderBill = ({ item, index }: { item: Bill; index: number }) => {
    const payer = group.users.find((user) => user.id === item.payerId);
    const action = payer.id === currentUser ? 'lent' : 'borrowed';
    const perPerson = item.amount / group.users.length;
    const details = `you ${action} \n $${(
      perPerson *
      (group.users.length - 1)
    ).toFixed(2)}`;
    return (
      <ListItem
        key={index}
        title={item.name}
        subtitle={`${payer.name} paid $${item.amount}`}
        rightTitle={details.charAt(0).toUpperCase() + details.slice(1)}
        rightTitleStyle={{ textAlign: 'right', fontSize: 12 }}
        titleStyle={{ fontWeight: 'bold' }}
        bottomDivider
      />
    );
  };

  return (
    <View>
      <View style={{ paddingTop: 30 }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 15,
          }}
        >
          {group.name.toUpperCase()}
        </Text>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
          }}
        >
          <Text style={{ textAlign: 'center' }}>
            {group.bills?.length || 0} Bills
          </Text>
          <Text style={{ textAlign: 'center' }}>
            {group.users?.length || 0} members
          </Text>
          <Text style={{ textAlign: 'center' }}>
            {(
              group.bills?.reduce((acc, next) => acc + next.amount, 0) || 0
            ).toFixed(1)}{' '}
            Expenses
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
          }}
        >
          <Button
            titleStyle={{ fontSize: 14 }}
            title={'Add an Expense'}
            onPress={addBill}
          />
          <Button
            style={{ marginHorizontal: 10 }}
            titleStyle={{ fontSize: 14 }}
            title={'Balances'}
            onPress={() => linkTo(`/groups/${params.id}/balances`)}
          />
        </View>
      </View>
      <Divider />
      <View>
        <FlatList
          keyExtractor={keyExtractor}
          data={group?.bills || []}
          renderItem={renderBill}
          ListEmptyComponent={(props) => (
            <ListEmptyState
              {...props}
              title={'Add a friend from Settings Menu to split expenses evenly'}
            />
          )}
        />
      </View>
      {isShowingBill && (
        <AddBillOverlay
          onDismiss={() => setShowingBillOverly(false)}
          group={group}
        />
      )}
    </View>
  );
};

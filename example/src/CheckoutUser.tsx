import { View, Button } from 'react-native';
import { useMonnifyCheckout } from 'react-native-monnify-webview';

const CheckoutUser = () => {
  const { open } = useMonnifyCheckout();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Open Checkout"
        onPress={() =>
          open(
            {
              checkoutParams: {
                amount: 100,
                currency: 'NGN',
                reference: new String(new Date().getTime()).toString(),
                contractCode: '5867418298',
                paymentDescription: 'Need',
                paymentMethods: ['CARD', 'USSD'],
                customerFullName: 'John',
                customerEmail: 'johndoe@example.com',
              },
              onClose: (data) => {
                console.log(data, 'DATA FROM WEBVIEW');
              },
              onSuccess: (data) => {
                console.log(data, 'DATA FROM WEBVIEW');
              },
              onError: (data) => {
                console.log(data, 'DATA FROM WEBVIEW');
              },
            },
            'bottom'
          )
        }
      />
    </View>
  );
};

export default CheckoutUser;

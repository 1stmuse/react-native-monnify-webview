import { MonnifyCheckoutProvider } from 'react-native-monnify-webview';
import CheckoutUser from './CheckoutUser';

export default function App() {
  return (
    <MonnifyCheckoutProvider apiKey="MK_TEST_GC3B8XG2XX">
      <CheckoutUser />
    </MonnifyCheckoutProvider>
  );
}

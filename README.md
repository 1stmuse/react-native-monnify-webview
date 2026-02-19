# react-native-monnify-webview

![CI](https://github.com/1stmuse/react-native-monnify-webview/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/react-native-monnify-webview)
![license](https://img.shields.io/npm/l/react-native-monnify-webview)

A lightweight React Native wrapper for integrating the **Monnify Web SDK** using `react-native-webview`.

---

## 📦 Installation

```bash
npm install react-native-monnify-webview react-native-webview react-native-safe-area-context
# or
yarn add react-native-monnify-webview react-native-webview react-native-safe-area-context
🚀 Usage
1️⃣ Wrap your App with the Provider
jsx
import { MonnifyCheckoutProvider } from 'react-native-monnify-webview';

export default function App() {
  return (
    <MonnifyCheckoutProvider apiKey="YOUR_MONNIFY_API_KEY">
      <MainApp />
    </MonnifyCheckoutProvider>
  );
}
2️⃣ Use the Hook to Open Checkout
jsx
import { useMonnifyCheckout } from 'react-native-monnify-webview';
import { Button } from 'react-native';

export default function PaymentScreen() {
  const { monnify } = useMonnifyCheckout();

  const handlePayment = () => {
    monnify.open({
      checkoutParams: {
        amount: 100,
        contractCode: "1234567890",
        customerFullName: "John Doe",
        customerEmail: "john@example.com",
        currency: "NGN",
        reference: Date.now().toString(),
        paymentMethods: ["CARD", "USSD"],
      },
      onSuccess: (data) => {
        console.log('Payment successful:', data.reference);
      },
      onClose: () => {
        console.log('Checkout closed');
      },
    });
  };

  return <Button title="Pay Now" onPress={handlePayment} />;
}
📘 API Reference
MonnifyCheckoutProvider
Prop	Type	Required	Description
apiKey	string	✅	Your Monnify API key
children	ReactNode	✅	Your app components
useMonnifyCheckout()
Returns an object with:

Property	Type	Description
monnify	object	Checkout control methods
isOpen	boolean	Current modal state
monnify.open(params)
Param	Type	Required	Description
checkoutParams	object	✅	Monnify payment parameters
onSuccess	function	❌	Called when payment succeeds
onClose	function	❌	Called when modal closes
Checkout Parameters
typescript
interface CheckoutParams {
  amount: number;                    // Payment amount
  contractCode: string;              // Your Monnify contract code
  customerFullName: string;          // Customer's full name
  customerEmail: string;             // Customer's email
  currency?: string;                 // Default: 'NGN'
  reference?: string;                // Unique transaction reference
  paymentDescription?: string;       // Transaction description
  paymentMethods?: string[];         // ['CARD', 'USSD', 'BANK_TRANSFER']
  metadata?: Record<string, any>;    // Custom metadata
  incomeSplitConfig?: any;           // Split payment configuration
}
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'feat: add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

text

## 🚨 Other Things to Check

1. **Package.json**: Ensure the main entry point is correct:
   ```json
   {
     "main": "dist/index.js",
     "types": "dist/index.d.ts"
   }
Actual exports: Make sure your code exports match what the README claims

Peer dependencies: Confirm they're correctly listed in package.json


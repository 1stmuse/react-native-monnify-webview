import type { CheckoutParams, MonnifyWebViewParams } from './types';

export const validateParams = (params: MonnifyWebViewParams): string | null => {
  if (
    !params.checkoutParams.amount ||
    typeof params.checkoutParams.amount !== 'number' ||
    params.checkoutParams.amount <= 0
  ) {
    return 'Amount must be a valid number greater than 0';
  }

  if (!params.checkoutParams.customerFullName) {
    return 'Customer full name is required';
  }
  if (!params.checkoutParams.customerEmail) {
    return 'Customer email is required';
  }

  if (!params.checkoutParams.paymentDescription) {
    return 'Payment description is required';
  }

  if (!params.checkoutParams.contractCode) {
    return 'Contract code is required';
  }

  if (!params.onClose) {
    return 'onClose is required';
  }

  if (!params.onSuccess) {
    return 'onSuccess is required';
  }
  if (!params.onError) {
    return 'onError is required';
  }

  return null;
};

const createMonnifyParams = (
  params: CheckoutParams & { apiKey: string }
): string => {
  const entries: string[] = [
    `apiKey: "${params.apiKey}"`,
    `amount: ${Number(params.amount)}`,
    `contractCode: "${params.contractCode}"`,
    `paymentDescription: "${params.paymentDescription}"`,
    `customerFullName: "${params.customerFullName}"`,
    `customerEmail: "${params.customerEmail}"`,
    // Event handlers as actual functions
    `onComplete: function(response) { 
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "onComplete", data: response })); 
    }`,
    `onClose: function(data) { 
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "onClose", data: data })); 
    }`,
    `onLoadStart: function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "onLoadStart" })); 
    }`,
    `onLoadComplete: function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({ event: "onLoadComplete" })); 
    }`,
  ];

  if (params.currency) entries.push(`currency: "${params.currency}"`);
  if (params.reference) entries.push(`reference: "${params.reference}"`);
  if (params.paymentMethods)
    entries.push(`paymentMethods: ${JSON.stringify(params.paymentMethods)}`);
  if (params.metadata)
    entries.push(`metadata: ${JSON.stringify(params.metadata)}`);
  if (params.incomeSplitConfig)
    entries.push(
      `incomeSplitConfig: ${JSON.stringify(params.incomeSplitConfig)}`
    );

  return entries.join(',\n');
};

export const createHtmlContent = (
  params: CheckoutParams & { apiKey: string }
) => {
  const config = createMonnifyParams(params);

  return `
    <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Monify</title>

                 <script
    type="text/javascript"
    src="https://sdk.monnify.com/plugin/monnify.js"
  ></script>
        <script>
          // Create the config object with proper function handlers
          var monnifyConfig = {
            ${config}
          };

          function initializeMonnify() {
            if (typeof MonnifySDK !== "undefined") {
              MonnifySDK.initialize(monnifyConfig);
            } else {
              setTimeout(initializeMonnify, 500);
            }
          }

          setTimeout(initializeMonnify, 500);
        </script>
    </head>
      <body style="height:100vh >
 
      </body>
    </html>
  `;
};

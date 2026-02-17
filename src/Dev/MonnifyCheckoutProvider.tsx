import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Toast, type ToastHandle, type ToastOptions } from './Toast';
import { createHtmlContent, validateParams } from '../lib/index';
import { ActivityIndicator, Modal, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import BackHander from './BackHander';
import type { MonnifyWebViewParams } from '../lib/types';

interface MonnifyContextInterface {
  monnify: {
    open: (
      params: MonnifyWebViewParams,
      toastPosition?: ToastOptions['position']
    ) => void;
  };
}

const MonnifyContext = React.createContext<MonnifyContextInterface | undefined>(
  undefined
);

interface MonnifyCheckoutProvider {
  apiKey: string;
  children: React.ReactNode;
}

const MonnifyCheckoutProvider = ({
  apiKey,
  children,
}: MonnifyCheckoutProvider) => {
  const [monnifyParams, setMonnifyParams] = useState<MonnifyWebViewParams>();
  const [isVisible, setIsVisible] = useState(false);
  const toastRef = useRef<ToastHandle>(null);
  const open = useCallback(
    (
      params: MonnifyWebViewParams,
      toastPosition?: ToastOptions['position']
    ) => {
      const validationError = validateParams(params);
      if (validationError) {
        toastRef.current?.show(validationError, {
          type: 'error',
          position: toastPosition,
        });
        return;
      }

      setMonnifyParams(params);
      setIsVisible(true);
    },
    []
  );

  const generateHtml = useMemo(() => {
    if (!monnifyParams) {
      console.log('monnifyParams is undefined');
      return '<html></html>';
    }

    return createHtmlContent({ ...monnifyParams.checkoutParams, apiKey });
  }, [monnifyParams, apiKey]);

  const closeWebView = () => {
    monnifyParams?.onClose(null);
    setIsVisible(false);
  };

  const webViewMessageHandler = ({ nativeEvent }: WebViewMessageEvent) => {
    const data = JSON.parse(nativeEvent.data);

    switch (data.event) {
      case 'onClose':
        setIsVisible(false);
        setMonnifyParams(undefined);
        monnifyParams?.onClose?.(data?.data);
        break;
      case 'onComplete':
        setIsVisible(false);
        setMonnifyParams(undefined);
        monnifyParams?.onSuccess?.(data?.data);
        break;
      default:
        break;
    }
  };

  return (
    <MonnifyContext.Provider
      value={{
        monnify: {
          open: open,
        },
      }}
    >
      {children}

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaProvider style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <View>
              <BackHander onPress={closeWebView} />
            </View>
            <WebView
              cacheEnabled
              originWhitelist={['*']}
              source={{ html: generateHtml }}
              onMessage={webViewMessageHandler}
              domStorageEnabled
              startInLoadingState
              onError={(e) => console.log('[Paystack] WebView Error', e)}
              renderLoading={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size="large" />
                </View>
              )}
              injectedJavaScript={`
              // Ensure ReactNativeWebView is available
              window.ReactNativeWebView = window.ReactNativeWebView || {};
              true;
            `}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
      <Toast ref={toastRef} />
    </MonnifyContext.Provider>
  );
};

export default MonnifyCheckoutProvider;

export const useMonnifyCheckout = () => {
  const context = React.useContext(MonnifyContext);
  if (context === undefined) {
    throw new Error(
      'useMonifyCheckout must be used within a MonifyCheckoutProvider'
    );
  }
  return context.monnify;
};

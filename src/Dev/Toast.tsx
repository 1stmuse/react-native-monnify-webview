import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import type { ViewStyle } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top' | 'center' | 'bottom';

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

export interface ToastHandle {
  show: (message: string, options?: ToastOptions) => void;
  hide: () => void;
}

const DEFAULT_DURATION = 3000;

export const Toast = forwardRef<ToastHandle, { containerStyle?: ViewStyle }>(
  ({ containerStyle }, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [position, setPosition] = useState<ToastPosition>('bottom');
    const durationRef = useRef<number>(DEFAULT_DURATION);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const bgColor = useMemo(() => {
      switch (type) {
        case 'success':
          return '#10b981';
        case 'error':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        default:
          return '#3b82f6';
      }
    }, [type]);

    const clearTimer = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const animateIn = useCallback(() => {
      translateY.setValue(
        position === 'top' ? -20 : position === 'bottom' ? 20 : 0
      );
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }, [opacity, translateY, position]);

    const animateOut = useCallback(
      (cb?: () => void) => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
          Animated.timing(translateY, {
            toValue: position === 'top' ? -10 : position === 'bottom' ? 10 : 0,
            duration: 180,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ]).start(() => {
          cb && cb();
        });
      },
      [opacity, translateY, position]
    );

    const show = useCallback(
      (msg: string, options?: ToastOptions) => {
        clearTimer();
        setMessage(msg);
        setType(options?.type ?? 'info');
        setPosition(options?.position ?? 'bottom');
        durationRef.current = options?.duration ?? DEFAULT_DURATION;
        setVisible(true);
        requestAnimationFrame(() => {
          animateIn();
          timerRef.current = setTimeout(() => {
            animateOut(() => setVisible(false));
          }, durationRef.current);
        });
      },
      [animateIn, animateOut, clearTimer]
    );

    const hide = useCallback(() => {
      clearTimer();
      animateOut(() => setVisible(false));
    }, [animateOut, clearTimer]);

    useImperativeHandle(ref, () => ({ show, hide }), [show, hide]);

    useEffect(() => {
      return () => {
        clearTimer();
      };
    }, [clearTimer]);

    const topInset =
      Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

    return (
      <TouchableWithoutFeedback onPress={hide}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[
            styles.container,
            position === 'top' && { top: topInset + 16, alignItems: 'center' },
            position === 'bottom' && { bottom: 32, alignItems: 'center' },
            position === 'center' && {
              top: '50%',
              marginTop: -32,
              alignItems: 'center',
            },
            { opacity, transform: [{ translateY }] },
            containerStyle,
          ]}
        >
          <Animated.View style={[styles.toast, { backgroundColor: bgColor }]}>
            <Text style={styles.text} numberOfLines={3}>
              {message}
            </Text>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Toast;

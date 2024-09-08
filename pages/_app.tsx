import { Provider } from 'react-redux';
import { store } from '@application/states/store';
import type { AppProps } from 'next/app';
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

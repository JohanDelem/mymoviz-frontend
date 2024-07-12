import '../styles/globals.css';
import Head from 'next/head';
import AppContextProvider from '../context/AppContext';
function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Next.js App</title>
      </Head>
      <AppContextProvider>
      <Component {...pageProps} />
      </AppContextProvider>
    </>
  );
}

export default App;

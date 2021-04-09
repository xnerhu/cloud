import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import {
  FONT_INTER_BOLD,
  FONT_INTER_MEDIUM,
  FONT_INTER_REGULAR,
} from 'constants/fonts';
import { UIStyle } from 'views/style';

const dev = process.env.NODE_ENV === 'development';

export const injectFonts = () => {
  if (typeof window === 'undefined') return;

  const styleElement = document.createElement('style');

  styleElement.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url(${FONT_INTER_REGULAR}) format('woff2');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url(${FONT_INTER_MEDIUM}) format('woff2');
      }

      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        src: url(${FONT_INTER_BOLD}) format('woff2');
      }
  `;
  document.head.appendChild(styleElement);
};

injectFonts();

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        <meta name="theme-color" content="#2196F3" />

        <title>Wexond: Web browser redefined.</title>
        <meta
          name="description"
          content="Wexond is an innovative web browser with a totally new user experience. It will change your productivity life for the better. Try it!"
        />
        <meta
          name="keywords"
          content="wexond, macos, linux, windows, ablock, nersent, productivity, extensions, chrome"
        />

        <link rel="icon" href="favicon.ico" />

        <meta property="og:image" content="https://wexond.net/icon.png" />
        <meta property="og:url" content="https://wexond.net" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wexond" />
        <meta name="twitter:title" content="Wexond" />

        {!dev && (
          <>
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-9KHKPQL4E8"
            />

            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments)}
              gtag("js", new Date());
              gtag("config", "G-9KHKPQL4E8");
            `,
              }}
            />
          </>
        )}
      </Head>
      <UIStyle />
      <Component {...pageProps} />
    </>
  );
};

export default App;

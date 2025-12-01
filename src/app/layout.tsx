import '@/index.css';
import React from 'react';

import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type {Metadata} from 'next';

import {AppProviders} from './providers';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'NHK',
  description: 'NHK frontend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}




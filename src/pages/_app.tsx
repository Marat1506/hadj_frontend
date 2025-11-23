import '@/index.css';

import React from 'react';


import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {AppProps} from 'next/app';

import Layout from '@/components/Layout';
import {Toaster as Sonner} from '@/components/ui/sonner';
import {Toaster} from '@/components/ui/toaster';
import {TooltipProvider} from '@/components/ui/tooltip';
import {ReduxProvider} from '@/store/providers';

config.autoAddCss = false;

const queryClient = new QueryClient();

export default function App({Component, pageProps}: AppProps) {

    return (
        <>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        <Toaster/>
                        <Sonner/>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </TooltipProvider>
                </QueryClientProvider>
            </ReduxProvider>
        </>
    );
}

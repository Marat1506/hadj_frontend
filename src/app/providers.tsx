'use client';

import React from 'react';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import Layout from '@/components/Layout';
import {Toaster as Sonner} from '@/components/ui/sonner';
import {Toaster} from '@/components/ui/toaster';
import {TooltipProvider} from '@/components/ui/tooltip';
import {ReduxProvider} from '@/store/providers';

const queryClient = new QueryClient();

export function AppProviders({children}: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Layout>{children}</Layout>
        </TooltipProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}



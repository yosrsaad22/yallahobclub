'use client';

import { getQueryClient } from '@/lib/query';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

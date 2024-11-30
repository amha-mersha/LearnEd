// app/components/ClientProviders.tsx
'use client';

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { NextIntlClientProvider } from 'next-intl';

export default function ClientProviders({ 
  children, 
  messages,
  locale 
}: { 
  children: React.ReactNode, 
  messages: IntlMessages,
  locale: string 
}) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </Provider>
  );
}
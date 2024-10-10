import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import * as Sentry from "@sentry/react";

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

Sentry.init({
    dsn: "https://0dbf67e679129b8304c17a8fab6db565@us.sentry.io/4506699739365376",
    integrations: [
        new Sentry.BrowserTracing({
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        }),
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = createRoot(document.getElementById('root'));

root.render(
    <ReduxProvider store={store}>
        <ContextProvider>
            <App />
        </ContextProvider>
    </ReduxProvider>
);

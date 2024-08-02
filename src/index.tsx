import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { ThemeProvider } from '@material-tailwind/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Analytics } from "@vercel/analytics/react"
import ErrorFallback from './components/error/errorFallback';

async function enableMocking() {
  // always enable mswjs until full backend is implemented
  // if (process.env.NODE_ENV !== 'development') {
  //   return
  // }

  const { worker } = await import('./mocks/browser')
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: 'bypass'
  })
}

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { StoreProvider } from './store/StoreProvider';
import { ErrorBoundary } from 'react-error-boundary';
import { globalErrorDialog, GlobalErrorDialog } from './components/error/globalErrorDialog';

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}



enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
      <ThemeProvider>
        <GlobalErrorDialog />
        <StoreProvider>
          <Analytics />
          {/* <SpeedInsights/> */}
          <RouterProvider router={router} />
        </StoreProvider>
      </ThemeProvider>
      {/* </ErrorBoundary> */}
    </React.StrictMode>
  )
})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

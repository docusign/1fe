import { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, RenderResult } from '@testing-library/react';

/**
 * This testing util renders the component but wraps it in a BrowserRouter.
 *
 * This prevents the common error "useLocation() may be used only in the context of a <Router> component" when you try...
 * to render a component with @testing-library/react that uses a react-router-dom hook but without a Router around it.
 */

export const renderWithBrowserRouterWrapper = (
  component: ReactNode,
): RenderResult => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * This testing util renders the component but wraps it in a MemoryRouter.
 *
 * This prevents the common error "useLocation() may be used only in the context of a <Router> component" when you try...
 * to render a component with @testing-library/react that uses a react-router-dom hook but without a Router around it.
 */
// export const renderWithMemoryRouterWrapper = (
//   component: ReactNode,
//   initialEntries?: string[],
// ) => {
//   return render(
//     <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
//   );
// };

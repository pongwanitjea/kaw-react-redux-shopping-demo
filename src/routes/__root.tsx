import { IconButton, Navbar, Typography, Menu, MenuHandler, MenuList, MenuItem, Badge } from '@material-tailwind/react';
import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
// import { SidebarWithBurgerMenu } from '../features/sidebar/sidebar';
import { useAppSelector, useAppDispatch } from '../store/hooks';
// import { selectSidebarOpenStatus, toggleSidebar } from '../features/sidebar/sidebarSlice';
import { UserCircleIcon, ShoppingCartIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { globalErrorDialog } from '../components/error/globalErrorDialog';
import { selectCart, CART_STATE_LS, clearCartAll } from '../slices/cartSlice';
import { selectActiveSession, LOGGED_IN_LS_KEY, login, logout } from '../slices/userSlice';

const NavListHorizontal = () => {
  return (
    <>
      {/* {NavDataList.map((navData) => (
        <Link to={navData.path} className="[&.active]:font-bold" key={navData.path}>
          {navData.display}
        </Link>
      ))} */}
    </>
  );
};

const MOBILE_BREAKPOINT = 600;
export const Route = createRootRoute({
  component: () => {
    const [mobileMode, setMobileMode] = useState(window.innerWidth < MOBILE_BREAKPOINT);
    // const sidebarOpened = useAppSelector(selectSidebarOpenStatus);
    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectCart);
    const cartItemCount = cart.reduce((total, item) => total + item.selectedAmount, 0);
    const navigate = useNavigate();

    // function toggleSidebarOuter() {
    //   dispatch(toggleSidebar());
    // }

    useEffect(() => {
      window.addEventListener(
        "resize",
        () => {
          if (window.innerWidth < MOBILE_BREAKPOINT) {
            setMobileMode(true)
          } else {
            setMobileMode(false)
          }
        },
      );
    }, []);

    // incomplete dark mode
    // const [darkMode, setDarkMode] = useState(false);

    // useEffect(() => {
    //   // Check for OS preference
    //   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //     setDarkMode(true);
    //   }

    //   // Listen for changes in OS preference
    //   window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    //     setDarkMode(event.matches);
    //   });
    // }, []);

    // useEffect(() => {
    //   if (darkMode) {
    //     document.documentElement.classList.add('dark');
    //   } else {
    //     document.documentElement.classList.remove('dark');
    //   }
    // }, [darkMode]);

    // const toggleDarkMode = () => {
    //   setDarkMode(!darkMode);
    // };


    const activeSession = useAppSelector(selectActiveSession);

    if (!activeSession.user) {
      const alreadyLoggedInData = localStorage.getItem(LOGGED_IN_LS_KEY);
      if (alreadyLoggedInData) {
        const decodedBase64 = atob(alreadyLoggedInData);
        const loggedInJson = JSON.parse(decodedBase64)
        dispatch(login(loggedInJson))
        //TODO I know this is design flaw, security vulnerability, no token signature, no token expire time, no backend validation of token, but this is just a demo
      }
    }

    return (
      <>
        {/* <SidebarWithBurgerMenu /> */}
        <Navbar className="sticky top-0 z-10 nav-bar-custom-height max-w-full rounded-none px-4 py-2 lg:px-8 dark:bg-gray-800">
          <div className="container mx-auto flex items-center justify-between text-blue-gray-900  dark:text-white">
            <div className="flex items-center">
              {/* disabled sidebar */}
              {/* {mobileMode && (
                <IconButton variant="text" size="lg" onClick={toggleSidebarOuter}>
                  {sidebarOpened ? (
                    <XMarkIcon className="h-8 w-8 stroke-2" />
                  ) : (
                    <Bars3Icon className="h-8 w-8 stroke-2" />
                  )}
                </IconButton>
              )} */}
              <Link to="/home" className="flex flex-row">
                <BuildingStorefrontIcon className="h-6 w-6 mr-1 dark:text-white" />
                <Typography
                  variant="h6"
                  className="mr-4 cursor-pointer lg:ml-2"
                >
                  {!mobileMode ? 'Pongwanit React Shopping Web Learning' : 'Kaw React Learning'}
                </Typography>
                {!mobileMode && <NavListHorizontal />}
              </Link>
            </div>

            {activeSession?.user ?
              <div className="flex items-center gap-2">
                {/* disabled darkmode button */}
                {/* <IconButton variant="text" size="lg" onClick={toggleDarkMode}>
                {darkMode ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </IconButton> */}
                {activeSession?.storeOwner ?
                  <Menu>
                    <MenuHandler>
                      <IconButton variant="text" size="lg">
                        <BuildingStorefrontIcon className="h-6 w-6" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                    <MenuItem onClick={() => { navigate({ to: '/store/manage' }) }}>Edit Store</MenuItem>
                      <MenuItem onClick={() => { navigate({ to: '/store/manage/order' }) }}>Incoming Orders</MenuItem>
                      <MenuItem onClick={() => { navigate({ to: '/store/manage/product' }) }}>Edit Products and Stock</MenuItem>
                    </MenuList>
                  </Menu> : <></>}
                <Link to="/cart">
                  <Badge content={cartItemCount} color="red">
                    <IconButton variant="text" size="lg">
                      <ShoppingCartIcon className="h-6 w-6" />
                    </IconButton>
                  </Badge>
                </Link>
                <Menu>
                  <MenuHandler>
                    <IconButton variant="text" size="lg">
                      <UserCircleIcon className="h-6 w-6" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => { navigate({ to: '/orders' }) }}>My Orders</MenuItem>
                    <MenuItem onClick={() => {
                      localStorage.removeItem(CART_STATE_LS)
                      dispatch(clearCartAll())
                      dispatch(logout())
                      navigate({ to: '/' })
                    }}>Log out</MenuItem>
                  </MenuList>
                  <Typography variant="h6">{activeSession.user}</Typography>
                </Menu>

              </div> : <div className="flex items-center gap-2">
                <IconButton variant="text" size="lg" onClick={() => {
                  navigate({ to: '/' })
                }}>
                  LOGIN
                </IconButton>
              </div>}
          </div>
        </Navbar>
        <hr />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </>
    )
  },
})
// import React from "react";
// import {
//     IconButton,
//     Typography,
//     List,
//     ListItem,
//     ListItemPrefix,
//     ListItemSuffix,
//     Chip,
//     Accordion,
//     AccordionHeader,
//     AccordionBody,
//     Alert,
//     Input,
//     Drawer,
//     Card,
// } from "@material-tailwind/react";
// import {
//     PresentationChartBarIcon,
//     ShoppingBagIcon,
//     UserCircleIcon,
//     Cog6ToothIcon,
//     InboxIcon,
//     PowerIcon,
// } from "@heroicons/react/24/solid";
// import {
//     ChevronRightIcon,
//     ChevronDownIcon,
//     CubeTransparentIcon,
//     MagnifyingGlassIcon,
//     Bars3Icon,
//     XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { useAppSelector, useAppDispatch } from "../../store/hooks";
// import { closeSidebar, selectSidebarOpenStatus } from "./sidebarSlice";
// import { NavDataList } from "../navData";
// import { Link } from "@tanstack/react-router";

// export function SidebarWithBurgerMenu() {

//     const [openAlert, setOpenAlert] = React.useState(true);
//     //   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
//     //   const openDrawer = () => setIsDrawerOpen(true);
//     //   const closeDrawer = () => setIsDrawerOpen(false);
//     const sidebarOpened = useAppSelector(selectSidebarOpenStatus);
//     const dispatch = useAppDispatch();

//     function closeSidebarOuter() {
//         dispatch(closeSidebar());
//     }

//     return (
//         <>
//             <Drawer open={sidebarOpened} onClose={closeSidebarOuter}>
//                 <Card
//                     color="transparent"
//                     shadow={false}
//                     className="h-[calc(100vh-2rem)] w-full p-4"
//                 >
//                     <div className="mb-2 flex items-center gap-4 p-4">
//                         <img
//                             src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
//                             alt="brand"
//                             className="h-8 w-8"
//                         />
//                         <Typography variant="h5" color="blue-gray">
//                             Sidebar
//                         </Typography>
//                     </div>
//                     <div className="p-2">
//                         <Input
//                             icon={<MagnifyingGlassIcon className="h-5 w-5" />}
//                             label="Search"
//                         />
//                     </div>
//                     <List>
//                         {NavDataList.map((navData) => (
//                             <Link to={navData.path} className="[&.active]:font-bold" key={navData.path} onClick={closeSidebarOuter}>
//                                 <ListItem>
//                                     <ListItemPrefix>
//                                         <InboxIcon className="h-5 w-5" />
//                                     </ListItemPrefix>
//                                     {navData.display}
//                                     <ListItemSuffix>
//                                 <Chip
//                                     value="14"
//                                     size="sm"
//                                     variant="ghost"
//                                     color="blue-gray"
//                                     className="rounded-full"
//                                 />
//                             </ListItemSuffix>
//                                 </ListItem>
//                             </Link>
//                         ))}
//                     </List>
//                     <Alert
//                         open={openAlert}
//                         className="mt-auto"
//                         onClose={() => setOpenAlert(false)}
//                     >
//                         <CubeTransparentIcon className="mb-4 h-12 w-12" />
//                         <Typography variant="h6" className="mb-1">
//                             Upgrade to PRO
//                         </Typography>
//                         <Typography variant="small" className="font-normal opacity-80">
//                             Upgrade to Material Tailwind PRO and get even more components,
//                             plugins, advanced features and premium.
//                         </Typography>
//                         <div className="mt-4 flex gap-3">
//                             <Typography
//                                 as="a"
//                                 href="#"
//                                 variant="small"
//                                 className="font-medium opacity-80"
//                                 onClick={() => setOpenAlert(false)}
//                             >
//                                 Dismiss
//                             </Typography>
//                             <Typography
//                                 as="a"
//                                 href="#"
//                                 variant="small"
//                                 className="font-medium"
//                             >
//                                 Upgrade Now
//                             </Typography>
//                         </div>
//                     </Alert>
//                 </Card>
//             </Drawer>
//         </>
//     );
// }
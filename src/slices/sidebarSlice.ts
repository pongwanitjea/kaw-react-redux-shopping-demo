// import { createAppSlice } from "../../store/createAppSlice";

// export interface SidebarSliceState {
//   opened: boolean;
// }

// const initialState: SidebarSliceState = {
//   opened: false
// };

// // If you are not using async thunks you can use the standalone `createSlice`.
// export const sidebarSlice = createAppSlice({
//   name: "sidebar",
//   initialState,
//   // The `reducers` field lets us define reducers and generate associated actions
//   reducers: (create) => ({
//     openSidebar: create.reducer((state) => {
//       state.opened = true;
//     }),
//     closeSidebar: create.reducer((state) => {
//       state.opened = false;
//     }),
//     toggleSidebar: create.reducer((state) => {
//       state.opened = !state.opened;
//     }),
//   }),
//   // You can define your selectors here. These selectors receive the slice
//   // state as their first argument.
//   selectors: {
//     selectSidebarOpenStatus: (sidebar) => sidebar.opened,
//   },
// });

// export const { openSidebar, closeSidebar, toggleSidebar } = sidebarSlice.actions;

// export const { selectSidebarOpenStatus } = sidebarSlice.selectors;

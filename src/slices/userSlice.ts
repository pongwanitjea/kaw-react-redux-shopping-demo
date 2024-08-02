import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../store/createAppSlice";
import { setToken } from "../tokenStore";


export interface ActiveSession {
    user?: string, storeOwner?: string, name?: string
}

const initialActiveSession: ActiveSession = {};

export const LOGGED_IN_LS_KEY = "LOGGED_IN"

export const activeSessionSlice = createAppSlice({
    name: "activeSessionSlice",
    initialState: initialActiveSession,
    reducers: (create) => ({
        logout: create.reducer(
            () => {
                setToken("");
                localStorage.removeItem(LOGGED_IN_LS_KEY)
                return initialActiveSession;
            }
        ),
        login: create.reducer(
            (state, action: PayloadAction<ActiveSession>) => {
                setToken(btoa(JSON.stringify(action.payload))); // TODO real thing would be actual JWT Token
                localStorage.setItem(LOGGED_IN_LS_KEY, btoa(JSON.stringify(action.payload)))
                return action.payload
            }
        )
    }),
    selectors: {
        selectActiveSession: (activeSession) => activeSession,
    },
})

export const { selectActiveSession } = activeSessionSlice.selectors;

export const { login, logout } = activeSessionSlice.actions;

export const DemoActiveSessions: ActiveSession[] = [
    {user: "USER1", name: "John Smith"},
    {user: "USER2", name: "Harun Morton "},
    {user: "USER3STORE1", storeOwner: "STORE1", name: "Zara Gilmore"},
    {user: "USER4STORE2", storeOwner: "STORE2", name: "Samuel Collins"},
]
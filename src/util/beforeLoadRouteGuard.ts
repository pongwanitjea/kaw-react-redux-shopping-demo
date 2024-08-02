import { redirect } from "@tanstack/react-router"
import { makeStore } from "../../store/store"
import { LOGGED_IN_LS_KEY, ActiveSession } from "../slices/userSlice";
import { CURRENT_TOKEN, setToken } from "../tokenStore";


export const beforeLoadRouteGuardLoginCheck = async ({ location }) => {
    // const user = makeStore().getState().activeSessionSlice.user
    if (CURRENT_TOKEN.length == 0) {
        const alreadyLoggedInData = localStorage.getItem(LOGGED_IN_LS_KEY);
        if (alreadyLoggedInData) {
            setToken(alreadyLoggedInData);
        } else {
            throwRedirect(location);
        }

    }
}

export const beforeLoadRouteGuardStoreOwnerCheck = async ({ location }) => {
    // const user = makeStore().getState().activeSessionSlice.user
    if (CURRENT_TOKEN.length == 0) {
        const alreadyLoggedInData = localStorage.getItem(LOGGED_IN_LS_KEY);
        if (alreadyLoggedInData) {
            setToken(alreadyLoggedInData);
            const token = JSON.parse(atob(alreadyLoggedInData)) as ActiveSession
            if (!token.storeOwner) {
                throw redirect({
                    to: '/store/unauthorized'
                })
            }
        } else {
            throwRedirect(location);
        }

    }
}

export const throwRedirect = (location) => {
    throw redirect({
        to: '/login/$redirect',
        params: {
            redirect: location.pathname,
        },
    })
}
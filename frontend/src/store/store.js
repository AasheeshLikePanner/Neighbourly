import {create, } from 'zustand'

const useStore  = create((set) => ({
    user: "",
    setUser: (userData) => set({user:userData})
}));

export default useStore;
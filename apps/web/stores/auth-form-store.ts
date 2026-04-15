"use client";

import { create } from "zustand";

type AuthMode = "sign-in" | "sign-up";

type FormState = {
  email: string;
  name: string;
  password: string;
};

type AuthFormStore = {
  error: string | null;
  form: FormState;
  isSubmitting: boolean;
  mode: AuthMode;
  resetForm: () => void;
  setError: (error: string | null) => void;
  setField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setMode: (mode: AuthMode) => void;
};

const INITIAL_FORM_STATE: FormState = {
  email: "",
  name: "",
  password: "",
};

export const useAuthFormStore = create<AuthFormStore>((set) => ({
  error: null,
  form: INITIAL_FORM_STATE,
  isSubmitting: false,
  mode: "sign-in",
  resetForm: () => set({ form: INITIAL_FORM_STATE }),
  setError: (error) => set({ error }),
  setField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setMode: (mode) => set({ mode }),
}));

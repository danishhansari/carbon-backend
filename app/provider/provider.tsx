"use client";

import { ReactNode } from "react";
import { PrimeReactProvider } from "primereact/api";

export function Provider({ children }: { children: ReactNode }) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
}

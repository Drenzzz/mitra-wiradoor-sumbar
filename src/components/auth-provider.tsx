"use client";

import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Better Auth reads the session via its own client; no provider is required.
export default function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}

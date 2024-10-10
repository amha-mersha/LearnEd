"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  expiresAt: string;
  role: string;
  tokenType: string;
}

// Custom hook to decode the token and extract the id
export const useJwtDecoder = (token: string | undefined) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        console.log(jwtDecode(token));
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded && decoded.id) {
          setId(decoded.id);
        }
      } catch (error) {
        console.error("Invalid JWT token", error);
      }
    }
  }, [token]);

  return id;
};

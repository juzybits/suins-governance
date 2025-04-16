"use client";

import { useEffect } from "react";

/**
 * Fix so we can use JSON.stringify on BigInts.
 */
export function BigIntFix() {
  useEffect(() => {
    // @ts-expect-error Property 'toJSON' does not exist on type 'BigInt'
    BigInt.prototype.toJSON = function() { return this.toString(); };
  }, []);
  return null;
}

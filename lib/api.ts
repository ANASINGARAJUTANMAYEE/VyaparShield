import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export const uuid = z.string().uuid();

export function validationError(error: ZodError) {
  return NextResponse.json({ error: "Invalid request.", details: error.flatten() }, { status: 400 });
}

export function databaseError(message: string) {
  return NextResponse.json({ error: "The request could not be completed.", detail: message }, { status: 500 });
}

// types/global.d.ts (create if needed)

declare global {
  // Allow global `mongoose` cache
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

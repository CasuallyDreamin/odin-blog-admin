import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";
import { server } from "./mocks/server";
import { mockRouter, mockPathname, mockSearchParams } from "./mocks/navigation";

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
  useSearchParams: () => mockSearchParams(),
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks(); 
  server.resetHandlers();
});

afterAll(() => server.close());
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.setTimeout(10000);

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

beforeEach(() => {
  fetchMock.resetMocks();
});

export const createMockAdapter = () => new MockAdapter(axios);

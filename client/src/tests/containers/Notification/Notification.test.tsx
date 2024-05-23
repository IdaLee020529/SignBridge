import React from "react";
import { render, cleanup } from "@testing-library/react";
import Notification from "@root/containers/Notification/Notification";
import Cookies from "js-cookie";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Define an interface for the expected methods in js-cookie
interface CookiesStatic {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  // Add other methods if needed
}

// Type assertion to specify the type of Cookies
const cookies: CookiesStatic = Cookies as CookiesStatic;

describe("Test Notification", () => {
  beforeEach(() => {
    // Set a temporary cookie using js-cookie for testing
    cookies.set("email", "test@example.com");
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
    // Clear the temporary cookie after each test
    cookies.remove("email");
  });

  it("should render correctly", () => {
    const { container } = render(<Notification />);

    expect(container).toMatchSnapshot();
  });
});

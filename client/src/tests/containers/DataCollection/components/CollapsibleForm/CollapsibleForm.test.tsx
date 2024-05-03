//Import necessary libraries -> either "@testing-library/react" or "react-test-renderer"
import { render, fireEvent } from "@testing-library/react";
import CollapsibleForm from "../../../../../containers/DataCollection/components/CollapsibleForm/CollapsibleForm";

describe("Test Collapsible Form", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  const props = {
    number: "1",
    form_id: 1,
    dateTime: "2023-11-11",
    status: "New",
    name: "Luffy Lee",
    email: "luffynika@example.com",
    text: "Aku mahu makan nasi",
    video_link: "testing123.mp4",
    avatar_link: "",
  };
  it("should render correctly", () => {
    const { container, getByText } = render(<CollapsibleForm {...props} />);
    const header = getByText(`No: ${props.number}`).closest(
      ".collapsible-content-header"
    );

    if (header) {
      fireEvent.click(header);
    }

    expect(container).toMatchSnapshot();
  });
});

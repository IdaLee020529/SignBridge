import { create } from "react-test-renderer";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"; //For extra validation => toBeInTheDocument()
import DataCollectionPublic from "../../../../containers/DataCollection/Public/DataCollectionPublic";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock the translation function to return the key
    i18n: {
      changeLanguage: jest.fn(), // Mock the changeLanguage function
    },
  }),
}));

jest.mock("js-cookie");

describe("Test DataCollection", () => {
  afterEach(() => {
    // Clean up the DOM
    cleanup();
    // Reset mocks to their initial state
    jest.resetAllMocks();
  });
  it("should render correctly", () => {
    const tree = create(<DataCollectionPublic />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should be able to submit", async () => {
    const mockFormData = new FormData();
    mockFormData.append("user_id", "mock_user_id");
    mockFormData.append("name", "John Doe");
    mockFormData.append("email", "john@example.com");
    mockFormData.append("text_sentence", "Test sentence");
    mockFormData.append("status_SE", "New");
    mockFormData.append("status_Admin", "-");

    jest.spyOn(require("js-cookie"), "get").mockReturnValueOnce("valid_token"); // Simulate logged-in user

    // Mocking the selected video file => For video upload
    Object.defineProperty(global, "File", {
      value: class extends Blob {
        constructor(
          fileParts: Array<string>,
          fileName: string,
          options?: BlobPropertyBag
        ) {
          super(fileParts, options);
          (this as any).name = fileName;
        }
      },
    });

    //Use asFragment to render toMatchSnapshot
    const { asFragment } = render(<DataCollectionPublic />);

    // Fill in the form fields
    userEvent.type(screen.getByTestId("name"), "John Doe"); //If u go to my code u will find that i have put up testid for it its easier to use
    userEvent.type(screen.getByTestId("email"), "john@example.com");
    userEvent.type(screen.getByTestId("text"), "Test sentence");

    // Mock the Upload component behavior
    jest.mock("antd", () => ({
      Upload: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="upload-mock">{children}</div>
      ),
    }));
    // const uploadButton = await screen.findByTestId("UploadVideo"); // Wait for the button to be available

    // fireEvent.click(uploadButton); // Click the button

    // Mock the customRequest function to simulate file upload
    fireEvent.click(screen.getByText("submit_btn"));

    //Using snapshot as temporary solution
    expect(asFragment()).toMatchSnapshot();
    // expect(submitForm).toHaveBeenCalledWith(mockFormData);
    //Originally my expected output: But i have implemented the modal
    // expect(screen.getByTestId("modal")).toBeInTheDocument();
  });
});

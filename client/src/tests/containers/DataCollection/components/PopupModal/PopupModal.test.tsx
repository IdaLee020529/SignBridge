import React from "react";
import PopupModal from "../../../../../containers/DataCollection/components/PopupModal/PopupModal";
import { cleanup } from "@testing-library/react";
import { create } from "react-test-renderer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock the translation function to return the key
    i18n: {
      changeLanguage: jest.fn(), // Mock the changeLanguage function
    },
  }),
}));

describe("Test PopupModal", () => {
  afterEach(cleanup); //Unmount all react tree after rendering
  const props = {
    isOpen: true,
    onClose: jest.fn(),
  };
  it("should render correctly", () => {
    const tree = create(<PopupModal {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

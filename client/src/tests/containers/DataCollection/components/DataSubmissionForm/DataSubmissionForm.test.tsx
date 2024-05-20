import React from "react";
import DataSubmissionForm from "../../../../../containers/DataCollection/components/DataSubmissionForm/DataSubmissionForm";
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
// Mock the useSpeechRecognition hook
jest.mock("react-speech-recognition", () => ({
  useSpeechRecognition: () => ({
    transcript: "Hello, World!",
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true,
  }),
}));
describe("Test DataSubmissionForm", () => {
  afterEach(cleanup); //Unmount all react tree after rendering
  const props = {
    user: "public",
    isSubmitModalOpen: false,
    showPopup: false,
    setShowPopup: jest.fn(),
    showInstructionPopup: false,
    setShowInstructionPopup: jest.fn(),
    onOpenModal: jest.fn(),
  };

  it("should render correctly", () => {
    const tree = create(<DataSubmissionForm {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

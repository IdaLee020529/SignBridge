import React from "react";
import InstructionPopup from "../../../../../containers/DataCollection/components/InstructionPopup/InstructionPopup";
import { cleanup } from "@testing-library/react";
import { create } from "react-test-renderer";

describe("Test InstructionPopup", () => {
  afterEach(() => {
    // Clean up the DOM
    cleanup();
    // Reset mocks to their initial state
    jest.resetAllMocks();
  });
  const props = {
    showInstructionPopup: true,
    onClose: jest.fn(),
  };
  it("should render correctly", () => {
    const tree = create(<InstructionPopup {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

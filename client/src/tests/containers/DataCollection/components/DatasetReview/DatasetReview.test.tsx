import React from "react";
import DatasetReview from "@root/containers/DataCollection/components/DatasetReview/DatasetReview";
import { create } from "react-test-renderer";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock the translation function to return the key
    i18n: {
      changeLanguage: jest.fn(), // Mock the changeLanguage function
    },
  }),
}));
describe("Test DatasetReview", () => {
  it("should render correctly", () => {
    const tree = create(<DatasetReview user={"public"} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

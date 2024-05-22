import OrderFilter from "@root/containers/DataCollection/components/Filter/OrderFilter/OrderFilter";
import React from "react";
import { create } from "react-test-renderer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock the translation function to return the key
    i18n: {
      changeLanguage: jest.fn(), // Mock the changeLanguage function
    },
  }),
}));
describe("Test OrderFilter", () => {
  it("should render correctly", () => {
    const props = {
      sortOrder: "asc",
      setSortOrder: jest.fn(),
    };
    const tree = create(<OrderFilter {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

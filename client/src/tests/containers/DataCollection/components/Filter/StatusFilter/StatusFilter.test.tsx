import StatusFilter from "@root/containers/DataCollection/components/Filter/StatusFilter/StatusFilter";
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
describe("Test StatusFilter", () => {
  it("should render correctly", () => {
    const props = {
      filterStatus: "All",
      setFilterStatus: jest.fn(),
      user: "public",
    };
    const tree = create(<StatusFilter {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

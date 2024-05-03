import { create } from "react-test-renderer";
import { render, fireEvent, cleanup, renderHook } from "@testing-library/react";
import DataCollectionPublic from "../../../../containers/DataCollection/Public/DataCollectionPublic";
import { I18nextProvider, useTranslation } from "react-i18next";
describe("Test DataCollection", () => {
  beforeEach(() => {
    jest.mock("react-i18next", () => ({
      useTranslation: () => ({ t: (key) => key }),
    }));
  });
  afterEach(cleanup);
  const t = renderHook(() => useTranslation());
  it("should render correctly", () => {
    const tree = create(<DataCollectionPublic />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

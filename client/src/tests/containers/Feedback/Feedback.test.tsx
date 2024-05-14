import { create } from "react-test-renderer";
import { render } from "@testing-library/react";
import Feedback from "../,./../../../containers/Feedback/Feedback";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock the translation function to return the key
    i18n: {
      changeLanguage: jest.fn(), // Mock the changeLanguage function
    },
  }),
}));
describe("Test Feedback", () => {
  it("should render correctly", () => {
    const tree = create(<Feedback />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

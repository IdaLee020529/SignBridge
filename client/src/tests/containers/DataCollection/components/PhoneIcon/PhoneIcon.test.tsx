import PhoneIcon from "../../../../../containers/DataCollection/components/PhoneIcon/PhoneIcon";
import { create } from "react-test-renderer";

describe("Test PhoneIcon", () => {
  it("should render correctly", () => {
    const tree = create(<PhoneIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

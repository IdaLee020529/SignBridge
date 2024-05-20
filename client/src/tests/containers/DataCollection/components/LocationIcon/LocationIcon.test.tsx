import LocationIcon from "../../../../../containers/DataCollection/components/LocationIcon/LocationIcon";
import { create } from "react-test-renderer";

describe("Test LocationIcon", () => {
  it("should render correctly", () => {
    const tree = create(<LocationIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

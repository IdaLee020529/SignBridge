import InfoIcon from "@root/containers/DataCollection/components/InfoIcon/InfoIcon";
import { create } from "react-test-renderer";

describe("Test InfoIcon", () => {
  it("should render correctly", () => {
    const tree = create(<InfoIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import EmailIcon from "@root/containers/DataCollection/components/EmailIcon/EmailIcon";
import { create } from "react-test-renderer";

describe("Test EmailIcon", () => {
  it("should render correctly", () => {
    const tree = create(<EmailIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

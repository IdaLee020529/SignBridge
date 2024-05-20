import InfoIcon from "../../../../../containers/DataCollection/components/InfoIcon/InfoIcon";
import { create } from "react-test-renderer";

describe("Test InfoIcon", () => {
  it("should render correctly", () => {
    const tree = create(<InfoIcon onClick={jest.fn()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

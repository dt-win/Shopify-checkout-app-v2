import Extension from "./Extension";
import { reactExtension } from "@shopify/ui-extensions-react/build/ts/surfaces/checkout";

const ThankYou = () => {
	return <Extension />;
};

export default reactExtension(
	"purchase.thank-you.block.render",
	() => <ThankYou />,
);

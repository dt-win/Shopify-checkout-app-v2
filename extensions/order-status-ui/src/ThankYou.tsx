import Extension from "./Extension";
import {
	reactExtension,
	useApi,
	useCurrency,
	useExtensionLanguage,
	useLanguage,
	useLocalizationCountry,
	useLocalizationMarket, usePurchasingCompany,
	useShop,
	useSubscription,
} from "@shopify/ui-extensions-react/checkout";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";

const ThankYou = () => {
	const { orderConfirmation } = useApi("purchase.thank-you.block.render");
	const { order } = useSubscription(orderConfirmation);

	const { myshopifyDomain } = useShop();

	setupSentry(myshopifyDomain, "thank-you");

	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();

	// As per the B2B Checkout UI guide, we can identify B2B purchases by the presence of a purchasing company.
	// In this case, we want to turn off Mention Me features.
	// https://shopify.dev/docs/apps/build/b2b/create-checkout-ui
	const purchasingCompany = usePurchasingCompany();

	const { loading, mentionMeConfig } = useMentionMeShopifyConfig({
			myshopifyDomain,
			extension: "order-status",
			extensionLanguage: extensionLanguage.isoCode,
			language: language.isoCode,
			country: country?.isoCode,
			currency: currency.isoCode,
			marketId: market?.id,
			marketHandle: market?.handle,
		},
	);

	if (purchasingCompany) {
		return null;
	}

	if (loading) {
		return <Extension.Skeleton />;
	}

	if (!mentionMeConfig) {
		return null;
	}

	return <ReferrerJourneyProvider mentionMeConfig={mentionMeConfig}
									orderId={order.id}>
		<Extension extensionType="thank-you" />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"purchase.thank-you.block.render",
	() => <ThankYou />,
);

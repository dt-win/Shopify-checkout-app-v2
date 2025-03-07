import {
	Banner,
	BlockStack,
	Button,
	Heading,
	Icon,
	Image,
	InlineStack,
	Link,
	Popover,
	Pressable,
	SkeletonImage,
	SkeletonTextBlock,
	TextBlock,
	useExtensionEditor,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { ReferrerJourneyContext } from "./context/ReferrerJourneyContext";
import useReferrerEntryPoint from "./hooks/useReferrerEntryPoint";
import { consoleError } from "../../../shared/logging";
import { logError } from "../../../shared/sentry";


import { ExtensionType } from "../../../shared/types";

interface Props {
	readonly extensionType: ExtensionType;
}

const Extension = ({ extensionType }: Props) => {
	const translate = useTranslate();

	const {
		partnerCode,
		environment,
		errorState,
		referrerEntryPointResponse,
	} = useContext(ReferrerJourneyContext);

	useReferrerEntryPoint(extensionType);

	// Now we're into the rendering part
	const editor = useExtensionEditor();

	if (!environment || typeof environment !== "string") {
		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me environment not set. Visit the Mention Me app settings in Shopify to choose an environment." />;
		}

		consoleError("Extension", "Invalid environment set", environment);
		return null;
	}

	if (!partnerCode || typeof partnerCode !== "string") {
		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me partner code needs to be set to show Mention Me journey. Visit the Mention Me app settings in Shopify to set the partner code." />;
		}

		consoleError("Extension", "Invalid Mention Me Partner Code set", partnerCode);
		return null;
	}

	if (errorState) {
		logError("Extension", "Error state", new Error(errorState));

		if (editor) {
			return <Banner status="critical"
						   title={"Failed to load Mention Me journey: " + errorState} />;
		}

		return null;
	}

	if (!referrerEntryPointResponse) {
		return null;
	}

	return (
		<View background="base">
			<BlockStack border="base"
						borderRadius="large"
			>
				{referrerEntryPointResponse.imageUrl && (
					<View

						// maxInlineSize={Style.default(200)
						// 	.when({ viewportInlineSize: { min: "small" } }, 200)
						// 	.when({ viewportInlineSize: { min: "medium" } }, 200)
						// 	.when({ viewportInlineSize: { min: "large" } }, 200)}
					>
						<Link external
							  to={referrerEntryPointResponse.url}>
							<Image borderRadius={["large", "large", "none", "none"]}
								   fit="cover"
								   source={referrerEntryPointResponse.imageUrl} />
						</Link>
					</View>
				)}
				<View borderRadius="large">
					<BlockStack padding="loose"
								spacing="base">
						<Heading level={2}>
							{referrerEntryPointResponse.headline}
						</Heading>
						<TextBlock>
							{referrerEntryPointResponse.description}
						</TextBlock>
						<Pressable overlay={
							<Popover>
								<View
									maxInlineSize={400}
									padding="base"
								>
									<TextBlock appearance="subdued">
										{referrerEntryPointResponse.privacyNotice}
										{" "}
										<Link external
											  to={referrerEntryPointResponse.privacyNoticeUrl}>
											{referrerEntryPointResponse.privacyNoticeLinkText || "More info and your privacy rights"}
										</Link>
									</TextBlock>
								</View>
							</Popover>
						}>
							<View background="subdued"
								  borderRadius="large"
								  padding="tight"
							>
								<InlineStack padding="extraTight"
											 spacing="extraTight"
								>
									<TextBlock appearance="subdued">
										{translate("managed-by")}
									</TextBlock>

									<Icon source="question" />
								</InlineStack>
							</View>
						</Pressable>

						<View blockAlignment="center"
							  minBlockSize="fill">
							{/*
							Button can't support "external".
							See https://github.com/Shopify/ui-extensions/issues/1835#issuecomment-2113067449
						 	And because Link can't be full width, the button is restricted in size :(
						 	*/}
							<Link external
								  to={referrerEntryPointResponse.url}
							>
								<Button inlineAlignment="center">
									{referrerEntryPointResponse.defaultCallToAction}
								</Button>
							</Link>
						</View>
					</BlockStack>
				</View>
			</BlockStack>
		</View>
	);
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
Extension.Skeleton = () => {
	return (
		<View background="base">
			<BlockStack border="base"
						borderRadius="large"
			>
				<SkeletonImage blockSize={250}
							   inlineSize={800} />
				<View borderRadius="large">
					<BlockStack padding="loose"
								spacing="base">
						<Heading level={2}>
							<SkeletonTextBlock lines={1} />
						</Heading>
						<TextBlock>
							<SkeletonTextBlock lines={2} />
						</TextBlock>

						<View background="subdued"
							  borderRadius="large"
							  padding="tight"
						>
							<InlineStack padding="extraTight"
										 spacing="extraTight"
							>
								<TextBlock appearance="subdued">
									<SkeletonTextBlock lines={1} />
								</TextBlock>

							</InlineStack>
						</View>

						<View blockAlignment="center"
							  minBlockSize="fill">
							<Button inlineAlignment="center">
								<SkeletonTextBlock lines={2} />
							</Button>
						</View>
					</BlockStack>
				</View>
			</BlockStack>
		</View>
	);
};

export default Extension;

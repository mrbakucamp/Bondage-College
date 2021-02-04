const InventoryItemDevicesWoodenBoxMaxLength = 20;
const InventoryItemDevicesWoodenBoxTextInputId = "InventoryItemDevicesWoodenBoxText";
const InventoryItemDevicesWoodenBoxOpacityInputId = "InventoryItemDevicesWoodenBoxOpacity";
const InventoryItemDevicesWoodenBoxFont = "'Saira Stencil One', 'Arial', sans-serif";

let InventoryItemDevicesWoodenBoxOriginalText = null;

let InventoryItemDevicesWoodenBoxOptions = [
	{
		Name: "SWNE",
		Property: { Type: null },
		from: [0, 1],
		to: [1, 0],
	},
	{
		Name: "NWSE",
		Property: { Type: "NWSE" },
		from: [0, 0],
		to: [1, 1],
	},
];

/**
 * Loads the wooden box's extended item properties
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxLoad() {
	DynamicDrawLoadFont(InventoryItemDevicesWoodenBoxFont);

	const C = CharacterGetCurrent();
	const item = DialogFocusItem;
	let mustRefresh = false;

	const Property = item.Property = item.Property || {};
	if (typeof Property.Text !== "string") {
		Property.Text = "";
		mustRefresh = true;
	}
	if (typeof Property.Opacity !== "number") {
		Property.Opacity = 0;
		InventoryItemDevicesWoodenBoxSetOpacity(Property, Property.Opacity);
		mustRefresh = true;
	}
	if (!InventoryItemDevicesWoodenBoxOptions.find(option => option.Property.Type === Property.Type)) {
		Property.Type = InventoryItemDevicesWoodenBoxOptions[0].Property.Type;
		mustRefresh = true;
	}

	if (mustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);
	}

	if (InventoryItemDevicesWoodenBoxOriginalText == null) {
		InventoryItemDevicesWoodenBoxOriginalText = Property.Text;
	}

	const textInput = ElementCreateInput(
		InventoryItemDevicesWoodenBoxTextInputId, "text", Property.Text, InventoryItemDevicesWoodenBoxMaxLength);
	if (textInput) {
		textInput.pattern = DynamicDrawTextInputPattern;
		textInput.addEventListener("input", (e) => InventoryItemDevicesWoodenBoxTextChange(C, item, e.target.value));
	}

	const opacitySlider = ElementCreateRangeInput(InventoryItemDevicesWoodenBoxOpacityInputId, Property.Opacity, item.Asset.MinOpacity, item.Asset.MaxOpacity, 0.01, "blindfold");
	if (opacitySlider) {
		opacitySlider.addEventListener("input", (e) => InventoryItemDevicesWoodenBoxOpacityChange(C, item, e.target.value));
	}
}

/**
 * Draw handler for the wooden box's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxDraw() {
	const asset = DialogFocusItem.Asset;

	// Draw the header and item
	DrawAssetPreview(1387, 125, asset);

	MainCanvas.textAlign = "right";
	DrawTextFit(DialogFindPlayer("WoodenBoxOpacityLabel"), 1475, 500, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesWoodenBoxOpacityInputId, 1725, 500, 400);

	DrawTextFit(DialogFindPlayer("WoodenBoxTextLabel"), 1475, 580, 400, "#fff", "#000");
	ElementPosition(InventoryItemDevicesWoodenBoxTextInputId, 1725, 580, 400);
	MainCanvas.textAlign = "center";

	DrawTextFit(DialogFindPlayer("WoodenBoxTypeLabel"), 1500, 660, 800, "#fff", "#000");

	InventoryItemDevicesWoodenBoxOptions.forEach((option, i) => {
		const x = ExtendedXY[InventoryItemDevicesWoodenBoxOptions.length][i][0];
		const isSelected = DialogFocusItem.Property.Type === option.Property.Type;
		DrawPreviewBox(x, 700, `${AssetGetInventoryPath(asset)}/${option.Name}.png`, "", {
			Border: true,
			Hover: true,
			Disabled: isSelected,
		});
	});
}

/**
 * Click handler for the wooden box's extended item screen
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxClick() {
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		return InventoryItemDevicesWoodenBoxExit();
	}

	InventoryItemDevicesWoodenBoxOptions.some((option, i) => {
		const x = ExtendedXY[InventoryItemDevicesWoodenBoxOptions.length][i][0];
		if (MouseIn(x, 700, 225, 275)) {
			DialogFocusItem.Property.Type = option.Property.Type;
			CharacterRefresh(CharacterGetCurrent(), false);
		}
	});
}

/**
 * Exits the wooden box's extended item screen, sends a chatroom message if appropriate, and cleans up inputs and text
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxExit() {
	const C = CharacterGetCurrent();
	const item = DialogFocusItem;

	InventoryItemDevicesWoodenBoxSetOpacity(item.Property, InventoryItemDevicesWoodenBoxGetInputOpacity());
	const text = InventoryItemDevicesWoodenBoxGetText();
	if (DynamicDrawTextRegex.test(text)) item.Property.Text = text;

	if (CurrentScreen === "ChatRoom" && text !== InventoryItemDevicesWoodenBoxOriginalText) {
		const dictionary = [
			{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			{ Tag: "NewText", Text: text },
			{ Tag: "AssetName", AssetName: item.Asset.Name },
		];
		const msg = text === "" ? "WoodenBoxTextRemove" : "WoodenBoxTextChange";
		ChatRoomPublishCustomAction(msg, false, dictionary);
	}

	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, item.Asset.Group.Name);

	ElementRemove(InventoryItemDevicesWoodenBoxTextInputId);
	ElementRemove(InventoryItemDevicesWoodenBoxOpacityInputId);
	InventoryItemDevicesWoodenBoxOriginalText = null;
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

/**
 * Sets the opacity of the wooden box based, and applies effects based on its opacity value
 * @param {Property} property - The item's Property object
 * @param {number} opacity - The opacity to set on the item's Property
 * @returns {void} - Nothing
 */
function InventoryItemDevicesWoodenBoxSetOpacity(property, opacity) {
	if (opacity !== property.opacity) property.Opacity = opacity;
	if (!Array.isArray(property.Effect)) property.Effect = [];
	const transparent = property.Opacity < 0.15;
	const effectsToApply = transparent ? ["Prone", "Enclose", "Freeze"] : ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"];
	const effectsToRemoves = transparent ? ["BlindNormal", "GagLight"] : [];
	property.Effect = property.Effect.filter(e => !effectsToRemoves.includes(e));
	effectsToApply.forEach(e => {
		if (!property.Effect.includes(e)) property.Effect.push(e);
	});
}

/**
 * Handles wooden box opacity changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesWoodenBoxOpacityChange = CommonDebounce((C, item, opacity) => {
	item = DialogFocusItem || item;
	item.Property.Opacity = Number(opacity);
	CharacterRefresh(C, false);
}, 100);

/**
 * Handles wooden box text changes. Refreshes the character locally
 * @returns {void} - Nothing
 */
const InventoryItemDevicesWoodenBoxTextChange = CommonDebounce((C, item, text) => {
	item = DialogFocusItem || item;
	if (DynamicDrawTextRegex.test(text)) {
		item.Property.Text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);
		CharacterRefresh(C, false);
	}
}, 200);

/**
 * Fetches the current text input value, trimmed appropriately
 * @returns {string} - The text in the wooden box's text input element
 */
function InventoryItemDevicesWoodenBoxGetText() {
	return ElementValue(InventoryItemDevicesWoodenBoxTextInputId).substring(0, InventoryItemDevicesWoodenBoxMaxLength);
}

/**
 * Fetches the current opacity input value, parsed to a number
 * @returns {number} - The value of the wooden box's opacity input slider
 */
function InventoryItemDevicesWoodenBoxGetInputOpacity() {
	return Number(ElementValue(InventoryItemDevicesWoodenBoxOpacityInputId));
}

/**
 * Dynamic AfterDraw function. Draws text onto the box.
 * @param {object} DrawingData - The dynamic drawing data
 * @returns {void} - Nothing
 */
function AssetsItemDevicesWoodenBoxAfterDraw({ C, A, X, Y, L, Pose, Property, drawCanvas, drawCanvasBlink, AlphaMasks, Color, Opacity }) {
	if (L === "_Text") {
		const height = 900;
		const width = 310;
		const tmpCanvas = AnimationGenerateTempCanvas(C, A, width, height);
		const ctx = tmpCanvas.getContext("2d");

		let text = Property && Property.Text || "";
		if (!DynamicDrawTextRegex.test(text)) text = "";
		text = text.substring(0, InventoryItemDevicesWoodenBoxMaxLength);

		let from = [0, 1];
		let to = [1, 0];

		if (Property && Property.Type) {
			const option = InventoryItemDevicesWoodenBoxOptions.find(o => o.Property.Type === Property.Type);
			if (option) {
				from = option.from;
				to = option.to;
			}
		}

		from = [width * from[0], height * from[1]];
		to = [width * to[0], height * to[1]];

		const { r, g, b } = DrawHexToRGB(Color);
		DynamicDrawTextFromTo(text, ctx, from, to, {
			fontSize: 96,
			fontFamily: InventoryItemDevicesWoodenBoxFont,
			color: `rgba(${r}, ${g}, ${b}, ${0.7 * Opacity})`,
		});

		let drawY = Y + 300;
		if (Pose === "Kneel/") drawY -= 250;

		// We print the canvas on the character based on the asset position
		drawCanvas(tmpCanvas, X + 90, drawY, AlphaMasks);
		drawCanvasBlink(tmpCanvas, X + 90, drawY, AlphaMasks);
	}
}


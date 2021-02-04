"use strict";
/**
 * Utility file for handling extended items
 */

/**
 * @typedef {Object} ExtendedItemOption
 * @description Defines a single extended item option
 * @property {string} Name - The name of the type - used for the preview icon and the translation key in the CSV
 * @property {number} [BondageLevel] - The required bondage skill level for this type (optional)
 * @property {number} [SelfBondageLevel] - The required self-bondage skill level for this type when using it on
 * yourself (optional)
 * @property {Property} Property - The Property object to be applied when this option is used
 */

/**
 * A lookup for the current pagination offset for all extended item options. Offsets are only recorded if the extended item requires
 * pagination.
 * Example format:
 * ```json
 * {
 *     "ItemArms/HempRope": 4,
 *     "ItemArms/Web": 0
 * }
 * ```
 * @type {Object.<string, number>}
 * @constant
 */
var ExtendedItemOffsets = {};

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXY = [
	[], //0 placeholder
	[[1385, 500]], //1 option per page
	[[1185, 500], [1590, 500]], //2 options per page
	[[1080, 500], [1385, 500], [1695, 500]], //3 options per page
	[[1185, 400], [1590, 400], [1185, 700], [1590, 700]], //4 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1185, 700], [1590, 700]], //5 options per page
	[[1080, 400], [1385, 400], [1695, 400], [1080, 700], [1385, 700], [1695, 700]], //6 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1080, 700], [1385, 700], [1695, 700]], //7 options per page
	[[1020, 400], [1265, 400], [1510, 400], [1755, 400], [1020, 700], [1265, 700], [1510, 700], [1755, 700]], //8 options per page
];

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXYWithoutImages = [
	[], //0 placeholder
	[[1400, 450]], //1 option per page
	[[1175, 450], [1425, 450]], //2 options per page
	[[1175, 450], [1425, 450], [1675, 450]], //3 options per page
	[[1175, 450], [1425, 450], [1175, 525], [1425, 525]], //4 options per page
	[[1175, 450], [1425, 450], [1675, 450], [1175, 525], [1425, 525]], //5 options per page
	[[1175, 450], [1425, 450], [1675, 450], [1175, 525], [1425, 525], [1675, 525]], //6 options per page
	[[1050, 450], [1200, 450], [1450, 450], [1700, 450], [1050, 525], [1200, 525], [1425, 525]], //7 options per page
	[[1050, 450], [1200, 450], [1450, 450], [1700, 450], [1050, 525], [1200, 525], [1425, 525], [1675, 525]], //8 options per page
];

/** The X & Y co-ordinates of each option's button, based on the number to be displayed per page. */
const ExtendedXYClothes = [
	[], //0 placeholder
	[[1385, 450]], //1 option per page
	[[1220, 450], [1550, 450]], //2 options per page
	[[1140, 450], [1385, 450], [1630, 450]], //3 options per page
	[[1220, 400], [1550, 400], [1220, 700], [1550, 700]], //4 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1220, 700], [1550, 700]], //5 options per page
	[[1140, 400], [1385, 400], [1630, 400], [1140, 700], [1385, 700], [1630, 700]], //6 options per page
];

/**
 * The current display mode
 * @type {boolean}
 */
var ExtendedItemPermissionMode = false;

/**
 * Loads the item extension properties
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item in the array should
 *     be the default option.
 * @param {string} DialogKey - The dialog key for the message to display prompting the player to select an extended type
 * @returns {void} Nothing
 */
function ExtendedItemLoad(Options, DialogKey) {
	if (!DialogFocusItem.Property) {
		// Default to the first option if no property is set
		DialogFocusItem.Property = JSON.parse(JSON.stringify(Options[0].Property));
		//Refresh the character if the base properties of the items do not correspond with its base type.
		var MustRefresh = false;
		if (DialogFocusItem.Asset.Effect == null && Array.isArray(Options[0].Property.Effect) && Options[0].Property.Effect.length > 0) MustRefresh = true;
		if (!MustRefresh && Array.isArray(DialogFocusItem.Asset.Effect) && Array.isArray(Options[0].Property.Effect))
			for (var E = 0; E <  Options[0].Property.Effect.length; E++)
				if (!DialogFocusItem.Asset.Effect.includes(Options[0].Property.Effect[E])) { 
					MustRefresh = true;
					break;
				}
		if (!MustRefresh && DialogFocusItem.Asset.Block == null && Array.isArray(Options[0].Property.Block) && Options[0].Property.Block.length > 0) MustRefresh = true;
		if (!MustRefresh && Array.isArray(DialogFocusItem.Asset.Block) && Array.isArray(Options[0].Property.Block))
			for (var E = 0; E <  Options[0].Property.Block.length; E++)
				if (!DialogFocusItem.Asset.Block.includes(Options[0].Property.Block[E])) { 
					MustRefresh = true;
					break;
					}
		if (MustRefresh) { 
			var C = CharacterGetCurrent() || CharacterAppearanceSelection;
			CharacterRefresh(C);
			ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
		}
	}

	if (ExtendedItemOffsets[ExtendedItemOffsetKey()] == null) ExtendedItemSetOffset(0);

	DialogExtendedMessage = DialogFind(Player, DialogKey);
}

/**
 * Draws the extended item type selection screen
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item in the array should
 *     be the default option.
 * @param {string} DialogPrefix - The prefix to the dialog keys for the display strings describing each extended type.
 *     The full dialog key will be <Prefix><Option.Name>
 * @param {number} OptionsPerPage - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes wether images should be shown for the specific item
 * @param {boolean} IsCloth - Whether or not the click is performed on a clothing item.
 * @returns {void} Nothing
 */
function ExtendedItemDraw(Options, DialogPrefix, OptionsPerPage, ShowImages = true, IsCloth) {
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	var IsSelfBondage = C.ID === 0;
	var Asset = DialogFocusItem.Asset;
	var ItemOptionsOffset = ExtendedItemGetOffset();
	var XYPositions = !IsCloth ? (ShowImages ? ExtendedXY : ExtendedXYWithoutImages) : ExtendedXYClothes;
	var ImageHeight = ShowImages ? 220 : 0;
	OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);
	
	// If we have to paginate, draw the back/next buttons
	if (Options.length > OptionsPerPage) {
		DrawButton(1665, 240, 90, 90, "", "White", "Icons/Prev.png");
		DrawButton(1775, 240, 90, 90, "", "White", "Icons/Next.png");
	}
	
	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "white");
	DrawImageResize("Assets/" + Asset.Group.Family + "/" + Asset.Group.Name + "/Preview/" + Asset.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(Asset.Description, 1500, 310, 221, "black");
	DrawText(DialogExtendedMessage, 1500, 375, "white", "gray");

	// Draw the possible variants and their requirements, arranged based on the number per page
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		var PageOffset = I - ItemOptionsOffset;
		var X = XYPositions[OptionsPerPage][PageOffset][0];
		var Y = XYPositions[OptionsPerPage][PageOffset][1];
		
		var Option = Options[I];
		var Hover = MouseIn(X, Y, 225, 55 + ImageHeight) && !CommonIsMobile;
		var FailSkillCheck = !!ExtendedItemRequirementCheckMessage(Option, IsSelfBondage);
		var IsSelected = DialogFocusItem.Property.Type == Option.Property.Type;
		var Blocked = InventoryIsPermissionBlocked(C, DialogFocusItem.Asset.DynamicName(Player), DialogFocusItem.Asset.DynamicGroupName, Option.Property.Type);
		var Limited = !InventoryCheckLimitedPermission(C, DialogFocusItem, Option.Property.Type);
		var PlayerBlocked = InventoryIsPermissionBlocked(Player, DialogFocusItem.Asset.DynamicName(Player), DialogFocusItem.Asset.DynamicGroupName, Option.Property.Type);
		var PlayerLimited = InventoryIsPermissionLimited(Player, DialogFocusItem.Asset.Name, DialogFocusItem.Asset.Group.Name, Option.Property.Type);
		var Color = ExtendedItemPermissionMode ? ((C.ID == 0 && IsSelected) || Option.Property.Type == null ? "#888888" : PlayerBlocked ? Hover ? "red" : "pink" : PlayerLimited ? Hover ? "orange" : "#fed8b1" : Hover ? "green" : "lime") : (IsSelected ? "#888888" : (Blocked || Limited) ? "Red" : FailSkillCheck ? "Pink" : Hover ? "Cyan" : "White");
		
		DrawButton(X, Y, 225, 55 + ImageHeight, "", Color, null, null, IsSelected);
		if (ShowImages) DrawImage("Screens/Inventory/" + Asset.Group.Name + "/" + Asset.Name + "/" + Option.Name + ".png", X + 2, Y);
		DrawTextFit(DialogFind(Player, DialogPrefix + Option.Name), X + 112, Y + 30 + ImageHeight, 225, "black");
	}
	
	// Permission mode toggle is always available
	DrawButton(1775, 25, 90, 90, "", "White", ExtendedItemPermissionMode ? "Icons/DialogNormalMode.png" : "Icons/DialogPermissionMode.png", DialogFind(Player, ExtendedItemPermissionMode ? "DialogNormalMode" : "DialogPermissionMode"));
}

/**
 * Handles clicks on the extended item type selection screen
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item in the array should
 *     be the default option.
 * @param {boolean} IsCloth - Whether or not the click is performed on a clothing item.
 * @param {number} OptionsPerPage - The number of options displayed on each page
 * @param {boolean} [ShowImages=true] - Denotes wether images are shown for the specific item
 * @returns {void} Nothing
 */
function ExtendedItemClick(Options, IsCloth, OptionsPerPage, ShowImages = true) {
	var C = CharacterGetCurrent() || CharacterAppearanceSelection;
	var IsSelfBondage = C.ID === 0;
	var ItemOptionsOffset = ExtendedItemGetOffset();
	var XYPositions = !IsCloth ? ShowImages ? ExtendedXY : ExtendedXYWithoutImages : ExtendedXYClothes;
	var ImageHeight = ShowImages ? 220 : 0;
	OptionsPerPage = OptionsPerPage || Math.min(Options.length, XYPositions.length - 1);

	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		DialogFocusItem = null;
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = false;
		return;
	}

	// Permission toggle button
	if (MouseIn(1775, 25, 90, 90)) { 
		if (ExtendedItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
		ExtendedItemPermissionMode = !ExtendedItemPermissionMode;
	}
	
	// Pagination buttons
	if (MouseIn(1665, 240, 90, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset - OptionsPerPage < 0) ExtendedItemSetOffset(OptionsPerPage * (Math.ceil(Options.length / OptionsPerPage) - 1));
		else ExtendedItemSetOffset(ItemOptionsOffset - OptionsPerPage);
	}
	if (MouseIn(1775, 240, 90, 90) && Options.length > OptionsPerPage) {
		if (ItemOptionsOffset + OptionsPerPage >= Options.length) ExtendedItemSetOffset(0);
		else ExtendedItemSetOffset(ItemOptionsOffset + OptionsPerPage);
	}
	
	// Options
	for (let I = ItemOptionsOffset; I < Options.length && I < ItemOptionsOffset + OptionsPerPage; I++) {
		var PageOffset = I - ItemOptionsOffset;
		var X = XYPositions[OptionsPerPage][PageOffset][0];
		var Y = XYPositions[OptionsPerPage][PageOffset][1];
		var Option = Options[I];
		if (MouseIn(X, Y, 225, 55 + ImageHeight)) {
			ExtendedItemHandleOptionClick(C, Options, Option, IsSelfBondage, IsCloth);
		}
	}
}

/**
 * Handler function for setting the type of an extended item
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item in the array should
 *     be the default option.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @param {boolean} IsCloth - Whether or not the click is performed on a clothing item.
 * @returns {void} Nothing
 */
function ExtendedItemSetType(C, Options, Option, IsCloth) {
    DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
	var FunctionPrefix = ExtendedItemFunctionPrefix();

	// An extendable item may provide a validation function. Returning false from the validation function will drop out of
	// this function, and the new type will not be applied.
	if (typeof window[FunctionPrefix + "Validate"] === "function") {
		if (CommonCallFunctionByName(FunctionPrefix + "Validate", C, Option) === false) {
			return;
		}
	}
	// Otherwise use the standard prerequisite check
	else if (Option.Prerequisite != null && !InventoryAllow(C, Option.Prerequisite, true)) {
		DialogExtendedMessage = DialogText;
		return;
	} else {
		const OldEffect= DialogFocusItem && DialogFocusItem.Property && DialogFocusItem.Property.Effect;
		if (OldEffect && OldEffect.includes("Lock") && Option.Property.AllowLock === false) {
			DialogExtendedMessage = DialogFind(Player, "ExtendedItemUnlockBeforeChange");
			return;
		}
	}

	if (CurrentScreen == "ChatRoom") {
		// Call the item's load function
		CommonCallFunctionByName(FunctionPrefix + "Load");
	}
	// Default the previous Property and Type to the first option if not found on the current item
	var PreviousProperty = DialogFocusItem.Property || Options[0].Property;
	var PreviousType = PreviousProperty.Type || Options[0].Property.Type;
	var PreviousOption = Options.find(O => O.Property.Type === PreviousType);

	// Create a new Property object based on the previous one
	var NewProperty = Object.assign({}, PreviousProperty);
	// Delete properties added by the previous option
	Object.keys(PreviousOption.Property).forEach(key => delete NewProperty[key]);
	// Clone the new properties and use them to extend the existing properties
	Object.assign(NewProperty, JSON.parse(JSON.stringify(Option.Property)));

	// If the item is locked, ensure it has the "Lock" effect
	if (NewProperty.LockedBy && !(NewProperty.Effect || []).includes("Lock")) {
		NewProperty.Effect = (NewProperty.Effect || []);
		NewProperty.Effect.push("Lock");
	}

	DialogFocusItem.Property = NewProperty;
	CharacterRefresh(C, !IsCloth); // Does not sync appearance while in the wardrobe
	
	// For a restraint, we might publish an action or change the dialog of a NPC
	if (!IsCloth) {
		ChatRoomCharacterUpdate(C);
		if (CurrentScreen === "ChatRoom") {
			// If we're in a chatroom, call the item's publish function to publish a message to the chatroom
			CommonCallFunctionByName(FunctionPrefix + "PublishAction", C, Option, PreviousOption);
		} else {
			DialogFocusItem = null;
			if (C.ID === 0) {
				// Player is using the item on herself
				DialogMenuButtonBuild(C);
			} else {
				// Otherwise, call the item's NPC dialog function, if one exists
				CommonCallFunctionByName(FunctionPrefix + "NpcDialog", C, Option, PreviousOption);
				C.FocusGroup = null;
			}
		}
	}
}

/**
 * Handler function called when an option on the type selection screen is clicked
 * @param {Character} C - The character wearing the item
 * @param {ExtendedItemOption[]} Options - An Array of type definitions for each allowed extended type. The first item in the array should
 *     be the default option.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @param {boolean} IsSelfBondage - Whether or not the player is applying the item to themselves
 * @param {boolean} IsCloth - Whether or not the click is performed on a clothing item.
 * @returns {void} Nothing
 */
function ExtendedItemHandleOptionClick(C, Options, Option, IsSelfBondage, IsCloth) {
	if (ExtendedItemPermissionMode) {
		if (Option.Property.Type == null || (C.ID == 0 && DialogFocusItem.Property.Type == Option.Property.Type)) return;
		InventoryTogglePermission(DialogFocusItem, Option.Property.Type);
	} else {
		var Blocked = InventoryIsPermissionBlocked(C, DialogFocusItem.Asset.DynamicName(Player), DialogFocusItem.Asset.DynamicGroupName, Option.Property.Type);
		var Limited = !InventoryCheckLimitedPermission(C, DialogFocusItem, Option.Property.Type);
		if (DialogFocusItem.Property.Type === Option.Property.Type || Blocked || Limited) return;
		
		var requirementMessage = ExtendedItemRequirementCheckMessage(Option, IsSelfBondage);
		if (requirementMessage) {
			DialogExtendedMessage = requirementMessage;
		} else {
			ExtendedItemSetType(C, Options, Option, IsCloth);
		}
	}
}

/**
 * Checks whether the player meets the requirements for an extended type option. This will check against their Bondage
 * skill if applying the item to another character, or their Self Bondage skill if applying the item to themselves.
 * @param {ExtendedItemOption} Option - The selected type definition
 * @param {boolean} IsSelfBondage - Whether or not the player is applying the item to themselves
 * @returns {string|null} null if the player meets the option requirements. Otherwise a string message informing them
 * of the requirements they do not meet
 */
function ExtendedItemRequirementCheckMessage(Option, IsSelfBondage) {
	if (IsSelfBondage) {
		let RequiredLevel = Option.SelfBondageLevel || Math.max(DialogFocusItem.Asset.SelfBondage, Option.BondageLevel);
		if (SkillGetLevelReal(Player, "SelfBondage") < RequiredLevel) {
			return DialogFind(Player, "RequireSelfBondage" + RequiredLevel);
		}
	} else {
		let RequiredLevel = Option.BondageLevel;
		if (SkillGetLevelReal(Player, "Bondage") < RequiredLevel) {
			return DialogFind(Player, "RequireBondageLevel").replace("ReqLevel", RequiredLevel);
		}
	}
	return null;
}

/**
 * Simple getter for the function prefix used for the currently focused extended item - used for calling standard
 * extended item functions (e.g. if the currently focused it is the hemp rope arm restraint, this will return
 * "InventoryItemArmsHempRope", allowing functions like InventoryItemArmsHempRopeLoad to be called)
 * @returns {string} The extended item function prefix for the currently focused item
 */
function ExtendedItemFunctionPrefix() {
	var Asset = DialogFocusItem.Asset;
	return "Inventory" + Asset.Group.Name + Asset.Name;
}

/**
 * Simple getter for the key of the currently focused extended item in the ExtendedItemOffsets lookup
 * @returns {string} The offset lookup key for the currently focused extended item
 */
function ExtendedItemOffsetKey() {
	var Asset = DialogFocusItem.Asset;
	return Asset.Group.Name + "/" + Asset.Name;
}

/**
 * Gets the pagination offset of the currently focused extended item
 * @returns {number} The pagination offset for the currently focused extended item
 */
function ExtendedItemGetOffset() {
	return ExtendedItemOffsets[ExtendedItemOffsetKey()];
}

/**
 * Sets the pagination offset for the currently focused extended item
 * @param {number} Offset - The new offset to set
 * @returns {void} Nothing
 */
function ExtendedItemSetOffset(Offset) {
	ExtendedItemOffsets[ExtendedItemOffsetKey()] = Offset;
}

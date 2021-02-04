"use strict";

/**
* Add a new item by group & name to character inventory
* @param {Character} C - The character that gets the new item added to her inventory
* @param {String} NewItemName - The name of the new item to add
* @param {String} NewItemGroup - The group name of the new item to add
* @param {Boolean} Push - Set to TRUE to push to the server
*/
function InventoryAdd(C, NewItemName, NewItemGroup, Push) {

	// First, we check if the inventory already exists, exit if it's the case
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == NewItemName) && (C.Inventory[I].Group == NewItemGroup))
			return;

	// Create the new item for current character's asset family, group name and item name
	var NewItem = InventoryItemCreate(C, NewItemGroup, NewItemName);

	// Only add the item if we found the asset
	if (NewItem) {
		// Pushes the new item to the inventory queue
		C.Inventory.push(NewItem);

		// Sends the new item to the server if it's for the current player
		if ((C.ID == 0) && ((Push == null) || Push))
			ServerPlayerInventorySync();
	}
}

/**
* Adds multiple new items by group & name to the character inventory
* @param {Character} C - The character that gets the new items added to her inventory
* @param {Array.<{ Name: string, Group: string }>} NewItems - The new items to add
* @param {Boolean} Push - Set to TRUE to push to the server, pushed by default
*/
function InventoryAddMany(C, NewItems, Push) {

	// Return if data is invalid
	if (C == null || !Array.isArray(NewItems)) return;
	
	var ShouldSync = false;
	
	// Add each items
	for (let NI = 0; NI < NewItems.length; NI++) { 
		// First, we check if the item already exists in the inventory, continue if it's the case
		var ItemExists = false;
		for (let I = 0; I < C.Inventory.length; I++)
			if ((C.Inventory[I].Name == NewItems[NI].Name) && (C.Inventory[I].Group == NewItems[NI].Group)) {
				ItemExists = true;
				break;
			}
		
		if (!ItemExists) { 
			// Create the new item for current character's asset family, group name and item name
			var NewItem = InventoryItemCreate(C, NewItems[NI].Group, NewItems[NI].Name);

			// Only add the item if we found the asset
			if (NewItem) {
				// Pushes the new item to the inventory and flag the refresh
				C.Inventory.push(NewItem);
				ShouldSync = true;
			}
		}
	}
	
	// Sends the new item(s) to the server if it's for the current player and an item was added
	if ((C.ID == 0) && ((Push == null) || Push) && ShouldSync) ServerPlayerInventorySync();
}

/**
 * Creates a new item for a character based on asset group and name
 * @param {Character} C - The character to create the item for
 * @param {string} Group - The name of the asset group the item belongs to
 * @param {string} Name - The name of the asset for the item
 * @return {Item} A new item for character using the specified asset name, or null if the specified asset could not be found in the named group
 */
function InventoryItemCreate(C, Group, Name) {
	var NewItemAsset = AssetGet(C.AssetFamily, Group, Name);
	if (NewItemAsset) return { Name, Group, Asset: NewItemAsset };
	return null;
}

/**
* Deletes an item from the character inventory
* @param {Character} C - The character on which we should remove the item
* @param {String} DelItemName - The name of the item to delete
* @param {String} DelItemGroup - The group name of the item to delete
* @param {Boolean} Push - Set to TRUE to push to the server
*/
function InventoryDelete(C, DelItemName, DelItemGroup, Push) {

	// First, we remove the item from the player inventory
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == DelItemName) && (C.Inventory[I].Group == DelItemGroup)) {
			C.Inventory.splice(I, 1);
			break;
		}

	// Next, we call the player account service to remove the item
	if ((C.ID == 0) && ((Push == null) || Push))
		ServerPlayerInventorySync();

}

/**
* Loads the current inventory for a character, can be loaded from an object of Name/Group or a compressed array using LZString
* @param {Character} C - The character on which we should load the inventory
* @param {Array} Inventory - An array of Name / Group of items to load
*/
function InventoryLoad(C, Inventory) {
	if (Inventory == null) return;
	if (typeof Inventory === "string") {
		var Inv = JSON.parse(LZString.decompressFromUTF16(Inventory));
		for (let I = 0; I < Inv.length; I++)
			InventoryAdd(C, Inv[I][0], Inv[I][1], false);
	}
	if (typeof Inventory === "object")
		for (let I = 0; I < Inventory.length; I++)
			InventoryAdd(C, Inventory[I].Name, Inventory[I].Group, false);
}

/**
* Checks if the character has the inventory available
* @param {Character} C - The character on which we should remove the item
* @param {String} InventoryName - The name of the item to validate
* @param {String} InventoryGroup - The group name of the item to validate
*/
function InventoryAvailable(C, InventoryName, InventoryGroup) {
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Name == InventoryName) && (C.Inventory[I].Group == InventoryGroup))
			return true;
	return false;
}

/**
* Returns an error message if a prerequisite clashes with the character's items and clothes
* @param {Character} C - The character on which we check for prerequisites
* @param {String} Prerequisite - The name of the prerequisite
* @returns {String} - The error tag, can be converted to an error message
*/
function InventoryPrerequisiteMessage(C, Prerequisite) {
	switch (Prerequisite) {
		// Basic prerequisites that can apply to many items
		case "NoItemFeet": return (InventoryGet(C, "ItemFeet") != null) ? "MustFreeFeetFirst" : "";
		case "NoItemArms": return (InventoryGet(C, "ItemArms") != null) ? "MustFreeArmsFirst" : "";
		case "NoItemLegs": return (InventoryGet(C, "ItemLegs") != null) ? "MustFreeLegsFirst" : "";
		case "NoItemHands": return (InventoryGet(C, "ItemHands") != null) ? "MustFreeHandsFirst" : "";
		case "LegsOpen": return CharacterItemsHavePose(C, "LegsClosed") ? "LegsCannotOpen" : "";
		case "NotKneeling": return CharacterItemsHavePose(C, "Kneel") ? "MustStandUpFirst" : "";
		case "CanKneel": return C.Effect.includes("BlockKneel") ? "MustBeAbleToKneel" : "";
		case "NotMounted": return C.Effect.includes("Mounted") ? "CannotBeUsedWhenMounted" : "";
		case "NotHorse": return C.Pose.includes("Horse") ? "CannotBeUsedWhenMounted" : "";
		case "NotSuspended": return C.Pose.includes("Suspension") || C.Pose.includes("SuspensionHogtied") ? "RemoveSuspensionForItem" : "";
		case "NotHogtied": return C.Pose.includes("Hogtied") ? "ReleaseHogtieForItem" : "";
		case "NotYoked": return CharacterItemsHavePose(C, "Yoked") ? "CannotBeUsedWhenYoked" : "";
		case "NotKneelingSpread": return C.Pose.includes("KneelingSpread") ? "MustStandUpFirst" : "";
		case "NotChaste": return C.Effect.includes("Chaste") ? "RemoveChastityFirst" : "";
		case "NotChained": return C.Effect.includes("IsChained") ? "RemoveChainForItem" : "";
		case "NoFeetSpreader": return InventoryIsItemInList(C, "ItemFeet", ["SpreaderMetal", "SpreaderVibratingDildoBar", "SpreaderDildoBar"]) ? "CannotBeUsedWithFeetSpreader" : "";
		case "NotShackled": return C.Effect.includes("Shackled") ? "RemoveShacklesFirst" : "";
		case "Collared": return (InventoryGet(C, "ItemNeck") == null) ? "MustCollaredFirst" : "";
		case "CannotHaveWand": return InventoryIsItemInList(C, "ItemArms", ["FullLatexSuit"]) ? "CannotHaveWand" : "";
		case "CannotBeSuited": return InventoryIsItemInList(C, "ItemVulva", ["WandBelt", "HempRopeBelt"]) ? "CannotHaveWand" : "";
		case "CannotBeHogtiedWithAlphaHood": return InventoryDoesItemHavePrerequisite(C, "ItemHood", "CanUseAlphaHood") ? Prerequisite : "";
		case "AllFours": return CharacterItemsHavePose(C, "AllFours") ? "CannotUse" : "";
		case "OnBed": return !C.Effect.includes("OnBed") ? "MustBeOnBed" : "";
		case "CuffedArms": return  !C.Effect.includes("CuffedArms") ? "MustBeArmCuffedFirst" : "";
		case "CuffedFeet": return !C.Effect.includes("CuffedFeet") ? "MustBeFeetCuffedFirst" : "";
		case "NoOuterClothes": return InventoryHasItemInAnyGroup(C, ["Cloth", "ClothLower"]) ? "RemoveClothesForItem" : "";
		case "NoMaidTray": return InventoryIsItemInList(C, "ItemMisc", ["WoodenMaidTray", "WoodenMaidTrayFull"]) ? "CannotBeUsedWhileServingDrinks" : "";
        case "CanBeCeilingTethered": return InventoryHasItemInAnyGroup(C, ["ItemArms", "ItemTorso", "ItemNeck", "ItemPelvis"]) ? "" : "AddItemsToUse";

		// Checks for torso access based on clothes
		case "AccessTorso": return !InventoryDoesItemExposeGroup(C, "Cloth", "ItemTorso") ? "RemoveClothesForItem" : "";

		// Breast items can be blocked by clothes
		case "AccessBreast": return !InventoryDoesItemExposeGroup(C, "Cloth", "ItemBreast") || !InventoryDoesItemExposeGroup(C, "Bra", "ItemBreast") ? "RemoveClothesForItem" : "";
		case "AccessBreastSuitZip": return !InventoryDoesItemExposeGroup(C, "Cloth", "ItemNipplesPiercings") || !InventoryDoesItemExposeGroup(C, "Suit", "ItemNipplesPiercings") ? "UnZipSuitForItem" : "";

		// Vulva/Butt items can be blocked by clothes, panties and some socks
		case "AccessVulva": return InventoryDoesItemBlockGroup(C, "Cloth", "ItemVulva")
			|| !InventoryDoesItemExposeGroup(C, "ClothLower", "ItemVulva")
			|| !InventoryDoesItemExposeGroup(C, "Panties", "ItemVulva")
			|| InventoryDoesItemBlockGroup(C, "Socks", "ItemVulva")
			? "RemoveClothesForItem" : "";
		case "AccessVulvaSuitZip": return !InventoryDoesItemExposeGroup(C, "SuitLower", "ItemVulvaPiercings") ? "UnZipSuitForItem" : "";

		// For body parts that must be naked
		case "NakedFeet": return InventoryHasItemInAnyGroup(C, ["ItemBoots", "Socks", "Shoes"]) ? "RemoveClothesForItem" : "";
		case "NakedHands": return InventoryHasItemInAnyGroup(C, ["ItemHands", "Gloves"]) ? "RemoveClothesForItem" : "";

		// Toe Tied
		case "ToeTied": return InventoryIsItemInList(C, "ItemFeet", ["SpreaderMetal", "SpreaderVibratingDildoBar", "SpreaderDildoBar"])
			|| InventoryIsItemInList(C, "ItemLegs", ["WoodenHorse"])
			|| InventoryIsItemInList(C, "ItemDevices", ["OneBarPrison", "SaddleStand"])
			? "LegsCannotClose" : "";

		// Display Frame
		case "DisplayFrame": return InventoryHasItemInAnyGroup(C, ["ItemArms", "ItemLegs", "ItemFeet", "ItemBoots"])
			? "RemoveRestraintsFirst"
			: InventoryHasItemInAnyGroup(C, ["Cloth", "ClothLower", "Shoes"])
			? "RemoveClothesForItem" : "";

		// Gas mask (Or face covering items going below the chin)
		case "GasMask": return InventoryIsItemInList(C, "ItemArms", ["Pillory"]) || InventoryIsItemInList(C, "ItemDevices", ["TheDisplayFrame"]) ? "RemoveRestraintsFirst" : "";
		case "NotMasked": return InventoryIsItemInList(C, "ItemHood", "OldGasMask") ? "RemoveFaceMaskFirst" : "";

		// Blocked remotes on self
		case "RemotesAllowed": return LogQuery("BlockRemoteSelf", "OwnerRule") && C.ID === 0 ? "OwnerBlockedRemotes" : "";

		// Layered Gags, prevent gags from being equipped over other gags they are incompatible with
		case "GagUnique": return C.FocusGroup && InventoryPrerequisiteConflictingGags(C, ["GagFlat", "GagCorset", "GagUnique"]);
		case "GagCorset": return C.FocusGroup && InventoryPrerequisiteConflictingGags(C, ["GagCorset"]);

		// Returns no message, indicating that all prerequisites are fine
		default: return "";
	}
}

<<<<<<< HEAD
	// Basic prerequisites that can apply to many items
	if (Prerequisite == "NoItemFeet") return (InventoryGet(C, "ItemFeet") != null) ? "MustFreeFeetFirst" : "";
	if (Prerequisite == "NoItemArms") return (InventoryGet(C, "ItemArms") != null) ? "MustFreeArmsFirst" : "";
	if (Prerequisite == "NoItemLegs") return (InventoryGet(C, "ItemLegs") != null) ? "MustFreeLegsFirst" : "";
	if (Prerequisite == "NoItemHands") return (InventoryGet(C, "ItemHands") != null) ? "MustFreeHandsFirst" : "";
	if (Prerequisite == "LegsOpen") return CharacterItemsHavePose(C, "LegsClosed") ? "LegsCannotOpen" : "";
	if (Prerequisite == "NotKneeling") return CharacterItemsHavePose(C, "Kneel") ? "MustStandUpFirst" : "";
	if (Prerequisite == "CanKneel") return (C.Effect.indexOf("BlockKneel") >= 0) ? "MustBeAbleToKneel" : "";
	if (Prerequisite == "NotMounted") return (C.Effect.indexOf("Mounted") >= 0) ? "CannotBeUsedWhenMounted" : "";
	if (Prerequisite == "NotHorse") return (C.Pose.indexOf("Horse") >= 0) ? "CannotBeUsedWhenMounted" : "";
	if (Prerequisite == "NotSuspended") return ((C.Pose.indexOf("Suspension") >= 0) || (C.Pose.indexOf("SuspensionHogtied") >=0)) ? "RemoveSuspensionForItem" : "";
	if (Prerequisite == "NotHogtied") return (C.Pose.indexOf("Hogtied") >= 0) ? "ReleaseHogtieForItem" : "";
	if (Prerequisite == "NotYoked") return CharacterItemsHavePose(C, "Yoked") ? "CannotBeUsedWhenYoked" : "";
	if (Prerequisite == "NotKneelingSpread") return (C.Pose.indexOf("KneelingSpread") >= 0) ? "MustStandUpFirst" : "";
	if (Prerequisite == "NotChaste") return (C.Effect.indexOf("Chaste") >= 0) ? "RemoveChastityFirst" : "";
	if (Prerequisite == "NotChained") return (C.Effect.indexOf("IsChained") >= 0) ? "RemoveChainForItem" : "";
	if (Prerequisite == "NoFeetSpreader") return ((InventoryGet(C, "ItemFeet") != null) && (InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderMetal" || InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderVibratingDildoBar" || InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderDildoBar")) ? "CannotBeUsedWithFeetSpreader" : "";
	if (Prerequisite == "NotShackled") return (C.Effect.indexOf("Shackled") >= 0) ? "RemoveShacklesFirst" : "";
	if (Prerequisite == "Collared") return (InventoryGet(C, "ItemNeck") == null) ? "MustCollaredFirst" : "";
	if (Prerequisite == "CannotHaveWand") return ((InventoryGet(C, "ItemArms") != null) && (InventoryGet(C, "ItemArms").Asset.Name == "FullLatexSuit")) ? "CannotHaveWand" : "";
	if (Prerequisite == "CannotBeSuited") return ((InventoryGet(C, "ItemVulva") != null) && (InventoryGet(C, "ItemVulva").Asset.Name == "WandBelt")) ? "CannotHaveWand" : "";
	if (Prerequisite == "CannotBeHogtiedWithAlphaHood") return ((InventoryGet(C, "ItemHood") != null) && (InventoryGet(C, "ItemHood").Asset.Prerequisite != null) && (InventoryGet(C, "ItemHood").Asset.Prerequisite.indexOf("CanUseAlphaHood") >= 0)) ? Prerequisite : "";
	if (Prerequisite == "AllFours") return CharacterItemsHavePose(C, "AllFours") ? "CannotUse" : "";
	if (Prerequisite == "OnBed") return ((InventoryGet(C, "ItemDevices") == null) || (InventoryGet(C, "ItemDevices").Asset.Name != "Bed")) ? "MustBeOnBed" : "";
	if (Prerequisite == "CuffedArms") return  (C.Effect.indexOf("CuffedArms") <= -1) ? "MustBeArmCuffedFirst" : "";
	if (Prerequisite == "CuffedFeet") return (C.Effect.indexOf("CuffedFeet") <= -1) ? "MustBeFeetCuffedFirst" : "";
	if (Prerequisite == "NoOuterClothes") return (InventoryGet(C, "Cloth") != null || InventoryGet(C, "ClothLower") != null) ? "RemoveClothesForItem" : "";
	if (Prerequisite == "NoMaidTray") return ((InventoryGet(C, "ItemMisc") != null) && ( InventoryGet(C, "ItemMisc").Asset.Name == "WoodenMaidTray" || InventoryGet(C, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")) ? "CannotBeUsedWhileServingDrinks" : "";
	
	// Checks for torso access based on clothes
	var Cloth = InventoryGet(C, "Cloth");
	if ((Prerequisite == "AccessTorso") && (Cloth != null) && !Cloth.Asset.Expose.includes("ItemTorso")) return "RemoveClothesForItem";

	// Breast items can be blocked by clothes
	if ((Prerequisite == "AccessBreast") && (((Cloth != null) && !Cloth.Asset.Expose.includes("ItemBreast"))
			|| (InventoryGet(C, "Bra") != null && !InventoryGet(C, "Bra").Asset.Expose.includes("ItemBreast")))) return "RemoveClothesForItem";
	if ((Prerequisite == "AccessBreastSuitZip") && (((Cloth != null) && !Cloth.Asset.Expose.includes("ItemNipplesPiercings"))
		    || (InventoryGet(C, "Suit") != null && !InventoryGet(C, "Suit").Asset.Expose.includes("ItemNipplesPiercings")))) return "UnZipSuitForItem";

	// Vulva/Butt items can be blocked by clothes, panties and some socks
	if ((Prerequisite == "AccessVulva") && (((Cloth != null) && Cloth.Asset.Block != null && Cloth.Asset.Block.includes("ItemVulva"))
			|| (InventoryGet(C, "ClothLower") != null && !InventoryGet(C, "ClothLower").Asset.Expose.includes("ItemVulva"))
			|| (InventoryGet(C, "Panties") != null && !InventoryGet(C, "Panties").Asset.Expose.includes("ItemVulva"))
			|| (InventoryGet(C, "Socks") != null && (InventoryGet(C, "Socks").Asset.Block != null) && InventoryGet(C, "Socks").Asset.Block.includes("ItemVulva")))) return "RemoveClothesForItem";
	if ((Prerequisite == "AccessVulvaSuitZip") && (
		(InventoryGet(C, "SuitLower") != null && !InventoryGet(C, "SuitLower").Asset.Expose.includes("ItemVulvaPiercings")))) return "UnZipSuitForItem";

	// For body parts that must be naked
	if ((Prerequisite == "NakedFeet") && ((InventoryGet(C, "ItemBoots") != null) || (InventoryGet(C, "Socks") != null) || (InventoryGet(C, "Shoes") != null))) return "RemoveClothesForItem";
	if ((Prerequisite == "NakedHands") && ((InventoryGet(C, "ItemHands") != null) || (InventoryGet(C, "Gloves") != null))) return "RemoveClothesForItem";

	// Toe Tied
	if (Prerequisite == "ToeTied" && (InventoryGet(C, "ItemFeet") != null) && (InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderMetal" || InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderVibratingDildoBar" || InventoryGet(C, "ItemFeet").Asset.Name == "SpreaderDildoBar")) return "LegsCannotClose";
	if (Prerequisite == "ToeTied" && (InventoryGet(C, "ItemLegs") != null) && (InventoryGet(C, "ItemLegs").Asset.Name == "WoodenHorse")) return "LegsCannotClose";
	if (Prerequisite == "ToeTied" && (InventoryGet(C, "ItemDevices") != null) && (InventoryGet(C, "ItemDevices").Asset.Name == "OneBarPrison")) return "LegsCannotClose";
	if (Prerequisite == "ToeTied" && (InventoryGet(C, "ItemDevices") != null) && (InventoryGet(C, "ItemDevices").Asset.Name == "SaddleStand")) return "LegsCannotClose";

	// Display Frame
	if (Prerequisite == "DisplayFrame" && (InventoryGet(C, "ItemArms") != null || InventoryGet(C, "ItemLegs") != null || InventoryGet(C, "ItemFeet") != null || InventoryGet(C, "ItemBoots") != null)) return "RemoveRestraintsFirst";
	if (Prerequisite == "DisplayFrame" && (InventoryGet(C, "Cloth") != null || InventoryGet(C, "ClothLower") != null || InventoryGet(C, "Shoes") != null)) return "RemoveClothesForItem";

	// Gas mask (Or face covering items going below the chin)
	if (Prerequisite == "GasMask" && (InventoryGet(C, "ItemArms") != null && InventoryGet(C, "ItemArms").Asset.Name == "Pillory" || InventoryGet(C, "ItemDevices") != null && InventoryGet(C, "ItemDevices").Asset.Name == "TheDisplayFrame")) return "RemoveRestraintsFirst";
	if (Prerequisite == "NotMasked"  && (InventoryGet(C, "ItemHood") != null) && (InventoryGet(C, "ItemHood").Asset.Name == "OldGasMask")) return "RemoveFaceMaskFirst";
	
	// Blocked remotes on self
	if (Prerequisite == "RemotesAllowed" && LogQuery("BlockRemoteSelf", "OwnerRule") && C.ID == 0) return "OwnerBlockedRemotes";
	
	// Layered Gags, prevent gags from being equipped over other gags they are incompatible with
	if (Prerequisite == "GagUnique" && C.FocusGroup) return InventoryPrerequisiteConflictingGags(C, ["GagFlat", "GagCorset", "GagUnique"]);
	if (Prerequisite == "GagCorset" && C.FocusGroup) return InventoryPrerequisiteConflictingGags(C, ["GagCorset"]);
=======
/**
 * Prerequisite utility function that returns TRUE if the given character has an item equipped in the provided group
 * whose name matches one of the names in the provided list.
 * @param {Character} C - The character for whom to check equipped items
 * @param {String} ItemGroup - The name of the item group to check
 * @param {String[]} ItemList - A list of item names to check against
 * @returns {boolean} - TRUE if the character has an item from the item list equipped in the named slot, FALSE
 * otherwise
 */
function InventoryIsItemInList(C, ItemGroup, ItemList) {
	const Item = InventoryGet(C, ItemGroup);
	return Item && ItemList.includes(Item.Asset.Name);
}
>>>>>>> upstream/master

/**
 * Prerequisite utility function that returns TRUE if the given character has an item equipped in the provided group
 * which has the provided prerequisite.
 * @param {Character} C - The character whose items should be checked
 * @param {String} ItemGroup - The name of the item group to check
 * @param {String} Prerequisite - The name of the prerequisite to look for
 * @returns {boolean} - TRUE if the character has an item equipped in the named slot which has the named prerequisite,
 * FALSE otherwise
 */
function InventoryDoesItemHavePrerequisite(C, ItemGroup, Prerequisite) {
	const Item = InventoryGet(C, ItemGroup);
	return Item && Item.Asset.Prerequisite && Item.Asset.Prerequisite.includes(Prerequisite);
}

/**
 * Prerequisite utility function that returns TRUE if the given character has an item equipped in the provided group
 * which blocks the target group.
 * @param {Character} C - The character whose items should be checked
 * @param {String} ItemGroup - The name of the group whose item should be checked
 * @param {String} TargetGroup - The name of the group that should be checked for being blocked
 * @returns {boolean} - TRUE if the character has an item equipped in the named slot which blocks the target group,
 * FALSE otherwise
 */
function InventoryDoesItemBlockGroup(C, ItemGroup, TargetGroup) {
	const Item = InventoryGet(C, ItemGroup);
	return Item && Item.Asset.Block && Item.Asset.Block.includes(TargetGroup);
}

/**
 * Prerequisite utility function that returns TRUE if the given character has an item equipped in the provided group
 * which exposes the target group.
 * @param {Character} C - The character whose items should be checked
 * @param {String} ItemGroup - The name of the group whose item should be checked
 * @param {String} TargetGroup - The name of the group that should be checked for being exposed
 * @returns {boolean} - TRUE if the character has an item equipped in the named slot which exposes the target group,
 * FALSE otherwise
 */
function InventoryDoesItemExposeGroup(C, ItemGroup, TargetGroup) {
	const Item = InventoryGet(C, ItemGroup);
	return !Item || Item.Asset.Expose.includes(TargetGroup);
}

/**
 * Prerequisite utility function that returns TRUE if the given character has an item equipped in any of the named group
 * slots.
 * @param {Character} C - The character whose items should be checked
 * @param {String[]} GroupList - The list of groups to check for items in
 * @returns {boolean} - TRUE if the character has any item equipped in any of the named groups, FALSE otherwise.
 */
function InventoryHasItemInAnyGroup(C, GroupList) {
	return GroupList.some(GroupName => !!InventoryGet(C, GroupName));
}

/**
 * Check if there are any gags with prerequisites that block the new gag from being applied
 * @param {Character} C - The character on which we check for prerequisites
 * @param {Array} BlockingPrereqs - The prerequisites we check for on lower gags
 * @returns {String} - Returns the prerequisite message if the gag is blocked, or an empty string if not
 */
function InventoryPrerequisiteConflictingGags(C, BlockingPrereqs) {
	// Index of the gag we're trying to add (1-indexed)
	var GagIndex = Number(C.FocusGroup.Name.replace("ItemMouth", "") || 1);
	var MouthItems = [InventoryGet(C, "ItemMouth"), InventoryGet(C, "ItemMouth2"), InventoryGet(C, "ItemMouth3")];
	var MinBlockingIndex = 0;
	for (let i = 0; i < MouthItems.length && !MinBlockingIndex; i++) {
		// Find the lowest indexed slot in which there is a gag with a prerequisite that blocks the new gag
		var AssetPrerequisite = MouthItems[i] && MouthItems[i].Asset.Prerequisite;
		if (BlockingPrereqs.indexOf(AssetPrerequisite) >= 0) MinBlockingIndex = i + 1;
	}
	// Not allowed to add the new gag if there is a blocking gag anywhere below it
	if (MinBlockingIndex && GagIndex > MinBlockingIndex) return "CannotBeUsedOverGag";
	else return "";
}

/**
* Returns TRUE if we can add the item, no other items must block that prerequisite
* @param {Character} C - The character on which we check for prerequisites
* @param {(Array|String)} Prerequisite - An array of prerequisites or a string for a single prerequisite
* @param {Boolean} SetDialog - If TRUE, set the screen dialog message at the same time
* @returns {Boolean} - TRUE if the item can be added to the character
*/
function InventoryAllow(C, Prerequisite, SetDialog) {

	// Prerequisite can be a string, in that case there's only one check
	var Msg = "";
	if (Prerequisite == null) return true;
	if ((typeof Prerequisite === "string") && (Prerequisite != ""))
		Msg = InventoryPrerequisiteMessage(C, Prerequisite);

	// Prerequisite can be an array of strings, in that case we check all items in the array and get the first error message
	if (Array.isArray(Prerequisite) && (Prerequisite.length > 0))
		for (let P = 0; ((P < Prerequisite.length) && (Msg == "")); P++)
			Msg = InventoryPrerequisiteMessage(C, Prerequisite[P]);

	// If no error message was found, we return TRUE, if a message was found, we can show it in the dialog
	if (Msg != "" && (SetDialog == null || SetDialog)) DialogSetText(Msg);
	return (Msg == "");

}

/**
* Gets the current item / cloth worn a specific area (AssetGroup)
* @param {Character} C - The character on which we must check the appearance
* @param {String} AssetGroup - The name of the asset group to scan
* @returns {AppearanceItem} - Returns the appearance which is the item / cloth asset, color and properties
*/
function InventoryGet(C, AssetGroup) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
			return C.Appearance[A];
	return null;
}

/**
* Makes the character wear an item on a body area
* @param {Character} C - The character that must wear the item
* @param {String} AssetName - The name of the asset to wear
* @param {String} AssetGroup - The name of the asset group to wear
* @param {String} ItemColor - The hex color of the item, can be undefined or "Default"
* @param {Number} Difficulty - The difficulty level to escape from the item
* @param {Number} MemberNumber - The member number of the character putting the item on - defaults to -1
*/
function InventoryWear(C, AssetName, AssetGroup, ItemColor, Difficulty, MemberNumber) {
	for (let A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == AssetName) && (Asset[A].Group.Name == AssetGroup)) {
			CharacterAppearanceSetItem(C, AssetGroup, Asset[A], ((ItemColor == null || ItemColor == "Default") && Asset[A].DefaultColor != null) ? Asset[A].DefaultColor : ItemColor, Difficulty, MemberNumber);
			InventoryExpressionTrigger(C, InventoryGet(C, AssetGroup));
			return;
		}
}

/**
* Sets the difficulty to remove an item for a body area
* @param {Character} C - The character that is wearing the item
* @param {String} AssetGroup - The name of the asset group
* @param {Int} Difficulty - The new difficulty level to escape from the item
*/
function InventorySetDifficulty(C, AssetGroup, Difficulty) {
	if ((Difficulty >= 0) && (Difficulty <= 100))
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
				C.Appearance[A].Difficulty = Difficulty;
	if ((CurrentModule != "Character") && (C.ID == 0)) ServerPlayerAppearanceSync();
}

/**
* Returns TRUE if there's already a locked item at a given body area
* @param {Character} C - The character that is wearing the item
* @param {String} AssetGroup - The name of the asset group (body area)
* @param {Boolean} CheckProperties - Set to TRUE to check for additionnal properties
* @returns {Boolean} - TRUE if the item is locked
*/
function InventoryLocked(C, AssetGroup, CheckProperties) {
	var I = InventoryGet(C, AssetGroup);
	return ((I != null) && InventoryItemHasEffect(I, "Lock", CheckProperties));
}

/**
* Makes the character wear a random item from a body area
* @param {Character} C - The character that must wear the item
* @param {String} GroupName - The name of the asset group (body area)
* @param {Int} Difficulty - The difficulty level to escape from the item
* @param {Boolean} Refresh - Do not call CharacterRefresh if false
* @param {Boolean} MustOwn - If TRUE, only assets that the character owns can be worn. Otherwise any asset can be used
* @returns {void} - Nothing
*/
function InventoryWearRandom(C, GroupName, Difficulty, Refresh, MustOwn) {
	if (!InventoryLocked(C, GroupName)) {
		var IsClothes = false;

		// Finds the asset group and make sure it's not blocked
		for (let A = 0; A < AssetGroup.length; A++)
			if (AssetGroup[A].Name == GroupName) {
				IsClothes = AssetGroup[A].Clothing;
				var IsBlocked = InventoryGroupIsBlocked(C, GroupName);
				if (IsBlocked) return;
				break;
			}

		// Restrict the options to assets owned by the character if required
		var AssetList = null;
		if (MustOwn) {
			CharacterAppearanceBuildAssets(C);
			AssetList = CharacterAppearanceAssets;
		}

		// Get and apply a random asset
		var SelectedAsset = InventoryGetRandom(C, GroupName, AssetList);

		// Pick a random color for clothes from their schema
		var SelectedColor = IsClothes ? SelectedAsset.Group.ColorSchema[Math.floor(Math.random() * SelectedAsset.Group.ColorSchema.length)] : null;

		CharacterAppearanceSetItem(C, GroupName, SelectedAsset, SelectedColor, Difficulty, null, Refresh);
	}
}

/**
 * Select a random asset from a group, narrowed to the most preferable available options (i.e unblocked/visible/unlimited) based on their binary "rank"
 * @param {Character} C - The character to pick the asset for
 * @param {String} GroupName - The asset group to pick the asset from. Set to an empty string to not filter by group.
 * @param {Array} AllowedAssets - Optional parameter: A list of assets from which one can be selected. If not provided, the full list of all assets is used.
 * @returns {Asset} - The randomly selected asset
 */
function InventoryGetRandom(C, GroupName, AllowedAssets) {
	var List = [];
	var AssetList = AllowedAssets || Asset;
	var RandomOnly = (AllowedAssets == null);

	var MinRank = Math.pow(2, 10);
	var BlockedRank = Math.pow(2, 2);
	var HiddenRank = Math.pow(2, 1);
	var LimitedRank = Math.pow(2, 0);
		
	for (let A = 0; A < AssetList.length; A++)
		if (((AssetList[A].Group.Name == GroupName && AssetList[A].Wear) || GroupName == null || GroupName == "") && (RandomOnly == false || AssetList[A].Random) && AssetList[A].Enable && InventoryAllow(C, AssetList[A].Prerequisite, false)) {
			var CurrRank = 0;

			if (InventoryIsPermissionBlocked(C, AssetList[A].Name, AssetList[A].Group.Name)) {
				if (BlockedRank > MinRank) continue;
				else CurrRank += BlockedRank;
			}

			if (CharacterAppearanceItemIsHidden(AssetList[A].Name, GroupName)) {
				if (HiddenRank > MinRank) continue;
				else CurrRank += HiddenRank;
			}

			if (InventoryIsPermissionLimited(C, AssetList[A].Name, AssetList[A].Group.Name)) {
				if (LimitedRank > MinRank) continue;
				else CurrRank += LimitedRank;
			}

			MinRank = Math.min(MinRank, CurrRank);
			List.push({ Asset: AssetList[A], Rank: CurrRank });
		}

	var PreferredList = List.filter(L => L.Rank == MinRank);
	if (PreferredList.length == 0) return null;

	var RandomAsset = PreferredList[Math.floor(Math.random() * PreferredList.length)].Asset;
	return RandomAsset;
}

/**
* Removes a specific item from a character body area
* @param {Character} C - The character on which we must remove the item
* @param {String} AssetGroup - The name of the asset group (body area)
* @param {false} [Refresh] - do not call CharacterRefresh if false
*/
function InventoryRemove(C, AssetGroup, Refresh) {

	// First loop to find the item and any sub item to remove with it
	for (var E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.Group.Name == AssetGroup) {
			let AssetToRemove = C.Appearance[E].Asset;
			let AssetToCheck = null;
			for (let R = 0; R < AssetToRemove.RemoveItemOnRemove.length; R++) {
				AssetToCheck = AssetToRemove.RemoveItemOnRemove[R];
				if (!AssetToCheck.Name) {
					// Just try to force remove a group, if no item is specified
					InventoryRemove(C, AssetToCheck.Group, false);
				} else {
					let AssetFound = InventoryGet(C, AssetToCheck.Group);
					// If a name is specified check if the item is worn
					if (AssetFound && (AssetFound.Asset.Name == AssetToCheck.Name))
						// If there is no type check or there is a type check and the item type matches, remove it
						if (AssetToCheck.Type) {
							if (AssetFound.Property && AssetFound.Property.Type === AssetToCheck.Type)
								InventoryRemove(C, AssetToCheck.Group, false);
						} else {
							InventoryRemove(C, AssetToCheck.Group, false);
						}
				}
			}
		}

	// Second loop to find the item again, and remove it from the character appearance
	for (let E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.Group.Name == AssetGroup) {
			C.Appearance.splice(E, 1);
			if (Refresh || Refresh == null) CharacterRefresh(C);
			return;
		}

}

/**
* Returns TRUE if the body area (Asset Group) for a character is blocked and cannot be used
* @param {Character} C - The character on which we validate the group
* @param {String} GroupName - The name of the asset group (body area)
* @param {Boolean} Activity - if TRUE check if activity is allowed on the asset group 
* @returns {Boolean} - TRUE if the group is blocked
*/
function InventoryGroupIsBlocked(C, GroupName, Activity) {

	if (Activity == null) Activity = false;
	
	// Default to characters focused group
	if (GroupName == null) GroupName = C.FocusGroup.Name;

    if (Activity) {
		for (let E = 0; E < C.Appearance.length; E++) {
			if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Asset.AllowActivityOn != null) && (C.Appearance[E].Asset.AllowActivityOn.includes(GroupName))){
				Activity = true;
				break;
			} else if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Property != null) && (C.Appearance[E].Property.AllowActivityOn != null) && (C.Appearance[E].Property.AllowActivityOn.indexOf(GroupName) >= 0)){
				Activity = true;
				break;
			} else Activity = false;
		}
    }

	// Items can block each other (hoods blocks gags, belts blocks eggs, etc.)
	for (let E = 0; E < C.Appearance.length; E++) {
		if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Asset.Block != null) && (C.Appearance[E].Asset.Block.includes(GroupName)) && !Activity) return true;
		if (!C.Appearance[E].Asset.Group.Clothing && (C.Appearance[E].Property != null) && (C.Appearance[E].Property.Block != null) && Array.isArray(C.Appearance[E].Property.Block) && (C.Appearance[E].Property.Block.indexOf(GroupName) >= 0) && !Activity) return true;
	}

	// If another character is enclosed, items other than the enclosing one cannot be used
	if ((C.ID != 0) && C.IsEnclose()) {
		for (let E = 0; E < C.Appearance.length; E++)
			if ((C.Appearance[E].Asset.Group.Name == GroupName) && InventoryItemHasEffect(C.Appearance[E], "Enclose", true))
				return false;
		return true;
	}

	// If the player is enclosed, all groups for another character are blocked
	if ((C.ID != 0) && Player.IsEnclose()) return true;

	// Nothing is preventing the group from being used
	return false;

}

/**
* Returns TRUE if an item has a specific effect
* @param {AppearanceItem} Item - The item from appearance that must be validated
* @param {String} Effect - The name of the effect to validate, can be undefined to check for any effect
* @param {Boolean} CheckProperties - Set to TRUE to check for item extra properties
* @returns {Boolean} - TRUE if the effect is on the item
*/
function InventoryItemHasEffect(Item, Effect, CheckProperties) {
	if (!Item) return null;
	if (!Effect) {
		if ((Item.Asset && Item.Asset.Effect && Item.Asset.Effect.length > 0) || (CheckProperties && Item.Property && Item.Property.Effect)) return true;
		else return false;
	}
	else {
		if ((Item.Asset && Item.Asset.Effect && Item.Asset.Effect.indexOf(Effect) >= 0) || (CheckProperties && Item.Property && Item.Property.Effect && Item.Property.Effect.indexOf(Effect) >= 0)) return true;
		else return false;
	}
}

/**
* Returns TRUE if an item lock is pickable
* @param {AppearanceItem} Item - The item from appearance that must be validated
* @returns {Boolean} - TRUE if PickDifficulty is on the item
*/
function InventoryItemIsPickable(Item) {
	if (!Item) return null;
	var lock = InventoryGetLock(Item)
	if (lock && lock.Asset && lock.Asset.PickDifficulty && lock.Asset.PickDifficulty > 0) return true;
	else return false;
	
}

/**
 * Returns the value of a given property of an appearance item, prioritizes the Property object.
 * @param {object} Item - The appearance item to scan 
 * @param {string} PropertyName - The property name to get.
 * @param {boolean} CheckGroup - Whether or not to fall back to the item's group if the property is not found on
 * Property or Asset.
 * @returns {any} - The value of the requested property for the given item. Returns undefined if the property or the
 * item itself does not exist.
 */
function InventoryGetItemProperty(Item, PropertyName, CheckGroup) {
    if (!Item || !PropertyName || !Item.Asset) return;
    let Property = Item.Property && Item.Property[PropertyName];
    if (typeof Property === "undefined") Property = Item.Asset[PropertyName];
    if (typeof Property === "undefined" && CheckGroup) Property = Item.Asset.Group[PropertyName];
    return Property;
}

/**
* Check if we must trigger an expression for the character after an item is used/applied
* @param {Character} C - The character that we must validate
* @param {AppearanceItem} Item - The item from appearance that we must validate
*/
function InventoryExpressionTrigger(C, Item) {
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.DynamicExpressionTrigger(C) != null))
		for (let E = 0; E < Item.Asset.DynamicExpressionTrigger(C).length; E++) {
			var Ex = InventoryGet(C, Item.Asset.DynamicExpressionTrigger(C)[E].Group);
			if ((Ex == null) || (Ex.Property == null) || (Ex.Property.Expression == null) || (Ex.Property.Expression == ""))
				CharacterSetFacialExpression(C, Item.Asset.DynamicExpressionTrigger(C)[E].Group, Item.Asset.DynamicExpressionTrigger(C)[E].Name, Item.Asset.DynamicExpressionTrigger(C)[E].Timer);
		}
}

/**
* Returns the padlock item that locks another item
* @param {AppearanceItem} Item - The item from appearance that must be scanned
* @returns {Asset} - The asset of the padlock item or NULL if none
*/
function InventoryGetLock(Item) {
	if ((Item == null) || (Item.Property == null) || (Item.Property.LockedBy == null)) return null;
	for (let A = 0; A < Asset.length; A++)
		if (Asset[A].IsLock && (Asset[A].Name == Item.Property.LockedBy))
			return { Asset: Asset[A] };
	return null;
}

/**
* Returns TRUE if the item has an OwnerOnly flag, such as the owner padlock
* @param {AppearanceItem} Item - The item from appearance that must be scanned
* @returns {Boolean} - TRUE if owner only
*/
function InventoryOwnerOnlyItem(Item) {
	if (Item == null) return false;
	if (Item.Asset.OwnerOnly) return true;
	if (Item.Asset.Group.Category == "Item") {
		var Lock = InventoryGetLock(Item);
		if ((Lock != null) && (Lock.Asset.OwnerOnly != null) && Lock.Asset.OwnerOnly) return true;
	}
	return false;
}

/**
* Returns TRUE if the item has a LoverOnly flag, such as the lover padlock
* @param {AppearanceItem} Item - The item from appearance that must be scanned
* @returns {Boolean} - TRUE if lover only
*/
function InventoryLoverOnlyItem(Item) {
	if (Item == null) return false;
	if (Item.Asset.LoverOnly) return true;
	if (Item.Asset.Group.Category == "Item") {
		var Lock = InventoryGetLock(Item);
		if ((Lock != null) && (Lock.Asset.LoverOnly != null) && Lock.Asset.LoverOnly) return true;
	}
	return false;
}

/**
* Returns TRUE if the character is wearing at least one restraint that's locked with an extra lock
* @param {Character} C - The character to scan
* @returns {Boolean} - TRUE if one restraint with an extra lock is found
*/
function InventoryCharacterHasLockedRestraint(C) {
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.IsRestraint && (InventoryGetLock(C.Appearance[A]) != null))
				return true;
	return false;
}

/**
 *
 * @param {Character} C - The character to scan
 * @param {String} LockName - The type of lock to check for
 * @returns {Boolean} - Returns TRUE if any item has the specified lock locked onto it
 */
function InventoryCharacterIsWearingLock(C, LockName) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.LockedBy == LockName))
			return true;
	return false;
}

/**
* Returns TRUE if the character is wearing at least one item that's a restraint with a OwnerOnly flag, such as the owner padlock
* @param {Character} C - The character to scan
* @returns {Boolean} - TRUE if one owner only restraint is found
*/
function InventoryCharacterHasOwnerOnlyRestraint(C) {
	if ((C.Ownership == null) || (C.Ownership.MemberNumber == null) || (C.Ownership.MemberNumber == "")) return false;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset.IsRestraint && InventoryOwnerOnlyItem(C.Appearance[A]))
				return true;
	return false;
}

/**
* Returns TRUE if the character is wearing at least one item that's a restraint with a LoverOnly flag, such as the lover padlock
* @param {Character} C - The character to scan
* @returns {Boolean} - TRUE if one lover only restraint is found
*/
function InventoryCharacterHasLoverOnlyRestraint(C) {
	if (C.GetLoversNumbers().length == 0) return false;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++) {
			if (C.Appearance[A].Asset.IsRestraint && InventoryLoverOnlyItem(C.Appearance[A]))
				return true;
		}
	return false;
}

/**
* Returns TRUE if at least one item on the character can be locked
* @param {Character} C - The character to scan
* @returns {Boolean} - TRUE if at least one item can be locked
*/
function InventoryHasLockableItems(C) {
	for (let I = 0; I < C.Appearance.length; I++)
		if (C.Appearance[I].Asset.AllowLock && (InventoryGetLock(C.Appearance[I]) == null))
			return true;
	return false;
}

/**
* Applies a lock to an appearance item of a character
* @param {Character} C - The character on which the lock must be applied
* @param {AppearanceItem} Item - The item from appearance to lock
* @param {(Asset|String)} Lock - The asset of the lock or the name of the lock asset
* @param {Int} MemberNumber - The member number to put on the lock
*/
function InventoryLock(C, Item, Lock, MemberNumber) {
	if (typeof Item === 'string') Item = InventoryGet(C, Item);
	if (typeof Lock === 'string') Lock = { Asset: AssetGet(C.AssetFamily, "ItemMisc", Lock) };
	if (Item && Lock && Lock.Asset.IsLock) {
		if (Item.Asset.AllowLock && (!Item.Property || Item.Property.AllowLock !== false)) {
			if (!Item.Asset.AllowLockType || Item.Asset.AllowLockType.includes(Item.Property.Type)) {
				if (Item.Property == null) Item.Property = {};
				if (Item.Property.Effect == null) Item.Property.Effect = [];
				if (Item.Property.Effect.indexOf("Lock") < 0) Item.Property.Effect.push("Lock");
<<<<<<< HEAD
=======
				if (Item.Property.Effect.indexOf("MemberNumberList") < 0) {
					if (!Item.Property) Item.Property = {}
					if (!Item.Property.MemberNumberList) Item.Property.MemberNumberList = "" + MemberNumber
				}
				
				if (!Item.Property.MemberNumberListKeys && Lock.Asset.Name == "HighSecurityPadlock") Item.Property.MemberNumberListKeys = "" + MemberNumber
>>>>>>> upstream/master
				Item.Property.LockedBy = Lock.Asset.Name;
				if (MemberNumber != null) Item.Property.LockMemberNumber = MemberNumber;
				if (Lock.Asset.RemoveTimer > 0) TimerInventoryRemoveSet(C, Item.Asset.Group.Name, Lock.Asset.RemoveTimer);
				CharacterRefresh(C, true);
			}
		}
	}
}

/**
* Unlocks an item and removes all related properties
* @param {Character} C - The character on which the item must be unlocked
* @param {AppearanceItem} Item - The item from appearance to unlock
*/
function InventoryUnlock(C, Item) {
	if (typeof Item === 'string') Item = InventoryGet(C, Item);
	if (Item && Item.Property && Item.Property.Effect) {
		Item.Property.Effect.splice(Item.Property.Effect.indexOf("Lock"), 1);
		delete Item.Property.LockedBy;
		delete Item.Property.RemoveTimer;
		delete Item.Property.LockSet;
		delete Item.Property.Password;
		delete Item.Property.Hint;
		delete Item.Property.LockMemberNumber;
		delete Item.Property.MemberNumberList;
		delete Item.Property.MemberNumberListKeys;
		delete Item.Property.CombinationNumber;
		delete Item.Property.LockPickSeed;
		CharacterRefresh(C);
	}
}

/**
* Applies a random lock on an item
* @param {Character} C - The character on which the item must be locked
* @param {AppearanceItem} Item - The item from appearance to lock
* @param {Boolean} FromOwner - Set to TRUE if the source is the owner, to apply owner locks
*/
function InventoryLockRandom(C, Item, FromOwner) {
	if (Item.Asset.AllowLock) {
		var List = [];
		for (let A = 0; A < Asset.length; A++)
			if (Asset[A].IsLock && Asset[A].Random && !Asset[A].LoverOnly && (FromOwner || !Asset[A].OwnerOnly))
				List.push(Asset[A]);
		if (List.length > 0) {
			var Lock = { Asset: InventoryGetRandom(C, null, List) };
			InventoryLock(C, Item, Lock);
		}
	}
}

/**
* Applies random locks on each character items that can be locked
* @param {Character} C - The character on which the items must be locked
* @param {Boolean} FromOwner - Set to TRUE if the source is the owner, to apply owner locks
*/
function InventoryFullLockRandom(C, FromOwner) {
	for (let I = 0; I < C.Appearance.length; I++)
		if (C.Appearance[I].Asset.AllowLock && (InventoryGetLock(C.Appearance[I]) == null))
			InventoryLockRandom(C, C.Appearance[I], FromOwner);
}

/**
* Removes all common keys from the player inventory
*/
function InventoryConfiscateKey() {
	InventoryDelete(Player, "MetalCuffsKey", "ItemMisc");
	InventoryDelete(Player, "MetalPadlockKey", "ItemMisc");
	InventoryDelete(Player, "IntricatePadlockKey", "ItemMisc");
	InventoryDelete(Player, "HighSecurityPadlockKey", "ItemMisc");
	InventoryDelete(Player, "Lockpicks", "ItemMisc");
}

/**
* Removes the remotes of the vibrators from the player inventory
*/
function InventoryConfiscateRemote() {
	InventoryDelete(Player, "VibratorRemote", "ItemVulva");
	InventoryDelete(Player, "VibratorRemote", "ItemNipples");
	InventoryDelete(Player, "LoversVibratorRemote", "ItemVulva");
}

/**
* Returns TRUE if the item is worn by the character
* @param {Character} C - The character to scan
* @param {String} AssetName - The asset / item name to scan
* @param {String} AssetGroup - The asset group name to scan
* @returns {Boolean} - TRUE if item is worn
*/
function InventoryIsWorn(C, AssetName, AssetGroup) {
	if ((C != null) && (C.Appearance != null) && Array.isArray(C.Appearance))
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset.Name == AssetName) && (C.Appearance[A].Asset.Group.Name == AssetGroup))
				return true;
	return false;
}

/**
 * Toggles an item's permission for the player
 * @param {object} Item - Appearance item to toggle
 * @param {object} Type - Type of the item to toggle
 * @returns {void} - Nothing 
 */
function InventoryTogglePermission(Item, Type) { 
	if (InventoryIsPermissionBlocked(Player, Item.Asset.Name, Item.Asset.Group.Name, Type)) {
		Player.BlockItems = Player.BlockItems.filter(B => B.Name != Item.Asset.Name || B.Group != Item.Asset.Group.Name || B.Type != Type);
		Player.LimitedItems.push({ Name: Item.Asset.Name, Group: Item.Asset.Group.Name, Type: Type });
	}
	else if (InventoryIsPermissionLimited(Player, Item.Asset.Name, Item.Asset.Group.Name, Type))
		Player.LimitedItems = Player.LimitedItems.filter(B => B.Name != Item.Asset.Name || B.Group != Item.Asset.Group.Name || B.Type != Type);
	else
		Player.BlockItems.push({ Name: Item.Asset.Name, Group: Item.Asset.Group.Name, Type: Type });
	ServerSend("AccountUpdate", { BlockItems: Player.BlockItems, LimitedItems: Player.LimitedItems });
}

/**
* Returns TRUE if a specific item / asset is blocked by the character item permissions
* @param {Character} C - The character on which we check the permissions
* @param {String} AssetName - The asset / item name to scan
* @param {String} AssetGroup - The asset group name to scan
* @param {String} AssetType - The asset type to scan
* @returns {Boolean} - TRUE if asset / item is blocked
*/
function InventoryIsPermissionBlocked(C, AssetName, AssetGroup, AssetType) {
	if ((C != null) && (C.BlockItems != null) && Array.isArray(C.BlockItems))
		for (let B = 0; B < C.BlockItems.length; B++)
			if ((C.BlockItems[B].Name == AssetName) && (C.BlockItems[B].Group == AssetGroup) && (C.BlockItems[B].Type == AssetType))
				return true;
	return false;
}

/**
 * Returns TRUE if a specific item / asset is limited by the character item permissions
 * @param {Character} C - The character on which we check the permissions
 * @param {String} AssetName - The asset / item name to scan
 * @param {String} AssetGroup - The asset group name to scan
 * @param {String} AssetType - The asset type to scan
 * @returns {Boolean} - TRUE if asset / item is limited
 */
function InventoryIsPermissionLimited(C, AssetName, AssetGroup, AssetType) {
	if ((C != null) && (C.LimitedItems != null) && Array.isArray(C.LimitedItems))
		for (let B = 0; B < C.LimitedItems.length; B++)
			if ((C.LimitedItems[B].Name == AssetName) && (C.LimitedItems[B].Group == AssetGroup) && (C.LimitedItems[B].Type == AssetType))
				return true;
	return false;
}

/**
 * Returns TRUE if the item is not limited, if the player is an owner or a lover of the character, or on their whitelist
 * @param {Character} C - The character on which we check the limited permissions for the item
 * @param {Item} Item - The item being interacted with
 * @param {String} ItemType - The asset type to scan
 * @returns {Boolean} - TRUE if item is allowed
 */
function InventoryCheckLimitedPermission(C, Item, ItemType) {
	if (!InventoryIsPermissionLimited(C, Item.Asset.DynamicName(Player), Item.Asset.DynamicGroupName, ItemType)) return true;
	if ((C.ID == 0) || C.IsLoverOfPlayer() || C.IsOwnedByPlayer()) return true;
	if ((C.ItemPermission < 3) && !(C.WhiteList.indexOf(Player.MemberNumber) < 0)) return true;
	return false;
}

/**
 * Returns TRUE if a specific item / asset is blocked or limited for the player by the character item permissions
 * @param {Character} C - The character on which we check the permissions
 * @param {Item} Item - The item being interacted with
 * @param {String} ItemType - The asset type to scan
 * @returns {Boolean} - Returns TRUE if the item cannot be used
 */
function InventoryBlockedOrLimited(C, Item, ItemType) {
	let Blocked = InventoryIsPermissionBlocked(C, Item.Asset.DynamicName(Player), Item.Asset.DynamicGroupName, ItemType);
	let Limited = !InventoryCheckLimitedPermission(C, Item, ItemType);
	return Blocked || Limited;
}

/**
 * Returns TRUE if the item is a key, having the effect of unlocking other items
 * @param {Item} Item - The item to validate
 * @returns {Boolean} - TRUE if item is a key
 */
function InventoryIsKey(Item) {
	if ((Item == null) || (Item.Asset == null) || (Item.Asset.Effect == null)) return false;
	for (let E = 0; E < Item.Asset.Effect.length; E++)
		if (Item.Asset.Effect[E].substr(0, 7) == "Unlock-")
			return true;
	return false;
}

/**
 * Serialises the provided character's inventory into a string for easy comparisons, inventory items are uniquely identified by their name and group
 * @param {Character} C - The character whose inventory we should serialise
 * @return {string} - A simple string representation of the character's inventory
 */
function InventoryStringify(C) {
	if (!C || !Array.isArray(C.Inventory)) return "";
	return C.Inventory.map(({ Name, Group }) => Group + Name ).join();
}

/**
 * Returns TRUE if the inventory category is blocked in the current chat room
 * @param {array} Category - An array of string containing all the categories to validate
 * @return {boolean} - TRUE if it's blocked
 */
function InventoryChatRoomAllow(Category) {
	if ((CurrentScreen == "ChatRoom") && (Category != null) && (Category.length > 0) && (ChatRoomData != null) && (ChatRoomData.BlockCategory != null) && (ChatRoomData.BlockCategory.length > 0))
		for (let C = 0; C < Category.length; C++)
			if (ChatRoomData.BlockCategory.indexOf(Category[C]) >= 0)
				return false;
	return true;
}

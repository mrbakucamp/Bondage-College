"use strict";

var InventoryItemArmsFuturisticArmbinderOptions = [
	{
		Name: "Normal",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Tight",
		Property: { Type: "Tight", Difficulty: 7 },
	},
];

// Loads the item extension properties
function InventoryItemArmsFuturisticArmbinderLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
	ExtendedItemLoad(InventoryItemArmsFuturisticArmbinderOptions, "SelectFuturisticArmbinderType");
}

// Draw the item extension screen
function InventoryItemArmsFuturisticArmbinderDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemArmsFuturisticArmbinderOptions, "FuturisticArmbinderType");
}

// Catches the item extension clicks
function InventoryItemArmsFuturisticArmbinderClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemArmsFuturisticArmbinderOptions);
}

function InventoryItemArmsFuturisticArmbinderExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}
	
function InventoryItemArmsFuturisticArmbinderValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}

function InventoryItemArmsFuturisticArmbinderPublishAction(C, Option) {
	var msg = "FuturisticArmbinderSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

"use strict";
var InventoryItemFeetFuturisticAnkleCuffsOptions = [
	{
		Name: "None",
		Property: {
<<<<<<< HEAD
			Type: null, SetPose: null, Difficulty: null, Effect: null
=======
			Type: null, SetPose: null, Difficulty: null, Effect: null, FreezeActivePose: [],
>>>>>>> upstream/master
		}
	},
	{
		Name: "Closed",
		Property: {
<<<<<<< HEAD
			Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6
=======
			Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6, FreezeActivePose: ["BodyLower"]
>>>>>>> upstream/master
		}
	}
];

// Loads the item extension properties
function InventoryItemFeetFuturisticAnkleCuffsLoad() {
 	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemFeetFuturisticAnkleCuffsOptions, "SelectBondagePosition");
}

// Draw the item extension screen
function InventoryItemFeetFuturisticAnkleCuffsDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemFeetFuturisticAnkleCuffsOptions, "LeatherAnkleCuffsPose");
}

// Catches the item extension clicks
function InventoryItemFeetFuturisticAnkleCuffsClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemFeetFuturisticAnkleCuffsOptions);
}


function InventoryItemFeetFuturisticAnkleCuffsExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemFeetFuturisticAnkleCuffsValidate(C, Option) {
 	return InventoryItemMouthFuturisticPanelGagValidate(C, Option)
}

function InventoryItemFeetFuturisticAnkleCuffsPublishAction(C, Option) {
	var msg = "FuturisticAnkleCuffsRestrain" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetFuturisticAnkleCuffsNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "LeatherAnkleCuffs" + Option.Name, "ItemFeet");
<<<<<<< HEAD
}
=======
}
>>>>>>> upstream/master

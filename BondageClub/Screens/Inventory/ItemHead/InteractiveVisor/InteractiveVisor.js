"use strict";

var InventoryItemHeadInteractiveVisorOptions = [
	{
		Name: "Transparent",
		Property: {
			Type: null,
			SelfUnlock: true,
			Effect: [],
		},
	},
	{
		Name: "LightTint",
		Property: {
			Type: "LightTint",
			Effect: ["BlindLight", "Prone"],
		},
	},
	{
		Name: "HeavyTint",
		Property: {
			Type: "HeavyTint",
			Effect: ["BlindNormal", "Prone"],
		},
	},
	{
		Name: "Blind",
		Property: {
			Type: "Blind",
			Effect: ["BlindHeavy", "Prone"],
		},
	},
];

function InventoryItemHeadInteractiveVisorLoad() {
	 var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else
		ExtendedItemLoad(InventoryItemHeadInteractiveVisorOptions, "SelectVisorType");
}

function InventoryItemHeadInteractiveVisorDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else
		ExtendedItemDraw(InventoryItemHeadInteractiveVisorOptions, "InteractiveVisorHeadType");
}

function InventoryItemHeadInteractiveVisorClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else
		ExtendedItemClick(InventoryItemHeadInteractiveVisorOptions);
}

function InventoryItemHeadInteractiveVisorPublishAction(C, Option) {
	var Message = "InteractiveVisorHeadSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
		{ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(Message, true, Dictionary);
}


function InventoryItemHeadInteractiveVisorExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemHeadInteractiveVisorValidate(C, Option) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}

function InventoryItemHeadInteractiveVisorNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemHeadInteractiveVisor" + Option.Name, "ItemHead");
}

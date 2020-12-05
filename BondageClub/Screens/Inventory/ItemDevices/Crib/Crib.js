"use strict";

//	g0 - Gate open
//	g1 - Gate closed
var InventoryItemDevicesCribGateOptions = [
	{
		Name: "g0",
		Difficulty: 0
	},
	{
		Name: "g1",
		IsRestraint: true,
		Effect: ["Freeze"], 
		Difficulty: 20
	}
];

//	p0 - No plushies
//	p1 - All the plushies!
var InventoryItemDevicesCribPlushieOptions = [
	{
		Name: "p0",
		Difficulty: 0
	},
	{
		Name: "p1",
		Difficulty: 2
	}
];

var InventoryItemDevicesCribPage = "Base";	//Sets main page for extend menu

var InventoryItemDevicesCribDrawFunctions = {
	Base: InventoryItemDevicesCribDrawBase,
	Gate: InventoryItemDevicesCribDrawGate,
	Plushies: InventoryItemDevicesCribDrawPlushie
};

var InventoryItemDevicesCribClickFunctions = {
	Base: InventoryItemDevicesCribClickBase,
	Gate: InventoryItemDevicesCribClickGate,
	Plushies: InventoryItemDevicesCribClickPlushie
};

function InventoryItemDevicesCribLoad() {
	if (!DialogFocusItem.Property) {
		var C = CharacterGetCurrent();
		var currentConfig = InventoryItemDevicesCribParseCurrent();
		DialogFocusItem.Property = InventoryItemDevicesCribMergeOptions(currentConfig[0], currentConfig[1]);
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	DialogExtendedMessage = DialogFind(Player, "ItemDevicesCribBase");
}

function InventoryItemDevicesCribCall(functionMap) {
	var func = functionMap[InventoryItemDevicesCribPage] || functionMap.Base;
	return func();
}

function InventoryItemDevicesCribDraw() {
	InventoryItemDevicesCribCall(InventoryItemDevicesCribDrawFunctions);
}

function InventoryItemDevicesCribClick() {
	InventoryItemDevicesCribCall(InventoryItemDevicesCribClickFunctions);
}

function InventoryItemDevicesCribPageTransition(newPage) {
	InventoryItemDevicesCribPage = newPage;
	DialogExtendedMessage = DialogFind(Player, "ItemDevicesCribSelect" + newPage);
}

function InventoryItemDevicesCribDrawCommon(buttonDefinitions) {
	var A = DialogFocusItem.Asset;
	// Draw the header and item
	DrawRect(1387, 55, 225, 275, "#fff");
	DrawImageResize("Assets/" + A.Group.Family + "/" + A.Group.Name + "/Preview/" + A.Name + ".png", 1389, 57, 221, 221);
	DrawTextFit(A.Description, 1500, 310, 221, "#000");
	DrawText(DialogExtendedMessage, 1500, 375, "#fff", "#808080");

	buttonDefinitions.forEach((buttonDefinition, i) => {
		var x = 1200 + (i % 2 * 387);
		var y = 450 + (Math.floor(i / 2) * 300);
		DrawButton(x, y, 225, 225, "", buttonDefinition[2] || "#fff");
		DrawImage(buttonDefinition[0], x, y);
		DrawText(DialogFind(Player, buttonDefinition[1]), x + 113, y - 20, "#fff", "#808080");
	});
}

function InventoryItemDevicesCribMapButtonDefinition(option) {
	var C = CharacterGetCurrent();
	var A = DialogFocusItem.Asset;
	var failLockCheck = DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem);
	var failSkillCheck = option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage;
	return [
		"Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/" + option.Name + ".png",
		"ItemDevicesCribType" + option.Name,
		(failLockCheck || failSkillCheck) ? "#ffc0cb" : "#fff",
	];
}

function InventoryItemDevicesCribDrawBase() {
	var A = DialogFocusItem.Asset;
	var DialogPrefix = "ItemDevicesCribConfigure";
	var currentConfig = InventoryItemDevicesCribParseCurrent();
	InventoryItemDevicesCribDrawCommon([
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/g" + currentConfig[0] + ".png", DialogPrefix + "Gate"],
		["Screens/Inventory/" + A.Group.Name + "/" + A.Name + "/p" + currentConfig[1] + ".png", DialogPrefix + "Plushies"],
	]);
}

function InventoryItemDevicesCribDrawGate() {
	InventoryItemDevicesCribDrawCommon(
		InventoryItemDevicesCribGateOptions.map(InventoryItemDevicesCribMapButtonDefinition),
	);
}

function InventoryItemDevicesCribDrawPlushie() {
	InventoryItemDevicesCribDrawCommon(
		InventoryItemDevicesCribPlushieOptions.map(InventoryItemDevicesCribMapButtonDefinition),
	);
}

function InventoryItemDevicesCribClickCommon(exitCallback, itemCallback) {
	// Exit button
	if (MouseIn(1885, 25, 90, 85)) {
		return exitCallback();
	}

	for (var i = 0; i < 4; i++) {
		var x = 1200 + (i % 2 * 387);
		var y = 450 + (Math.floor(i / 2) * 300);
		if (MouseIn(x, y, 225, 225)) {
			itemCallback(i);
		}
	}
}

function InventoryItemDevicesCribClickComponent(options) {
	InventoryItemDevicesCribClickCommon(
		() => InventoryItemDevicesCribPageTransition("Base"),
		i => {
			const selected = options[i];
			if (selected) InventoryItemDevicesCribSetType(selected);
		},
	);
}

function InventoryItemDevicesCribClickBase() {
	var configPages = ["Gate", "Plushies"];
	InventoryItemDevicesCribClickCommon(
		() => DialogFocusItem = null,
		i => {
			const newPage = configPages[i];
			if (newPage) InventoryItemDevicesCribPageTransition(newPage);
		},
	);
}

function InventoryItemDevicesCribClickGate() {
	InventoryItemDevicesCribClickComponent(InventoryItemDevicesCribGateOptions);
}

function InventoryItemDevicesCribClickPlushie() {
	InventoryItemDevicesCribClickComponent(InventoryItemDevicesCribPlushieOptions);
}

function InventoryItemDevicesCribSetType(option) {
	var C = CharacterGetCurrent();
	DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

	// Lock check - cannot change type if you can't unlock the item
	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		return;
	}

	// Self bondage requirement check
	if (option.SelfBondage && C.ID === 0 && SkillGetLevelReal(C, "SelfBondage") < option.SelfBondage) {
		DialogExtendedMessage = DialogFind(Player, "RequireSelfBondage" + option.SelfBondage);
		return;
	}

	var currentConfig = InventoryItemDevicesCribParseCurrent();
	var g = currentConfig[0];
	var p = currentConfig[1];
	var componentType = option.Name[0];
	var componentIndex = Number(option.Name[1]);
	var hasChanged = false;
	switch (componentType) {
		case "g":
			if (g !== componentIndex) hasChanged = true;
			g = componentIndex;
			break;
		case "p":
			if (p !== componentIndex) hasChanged = true;
			p = componentIndex;
			break;
	}

	if (hasChanged) {
		Object.assign(DialogFocusItem.Property, InventoryItemDevicesCribMergeOptions(g, p));
		CharacterRefresh(C);
		ChatRoomCharacterUpdate(C);

		if (CurrentScreen === "ChatRoom") {
			InventoryItemDevicesCribChatRoomMessage(option.Name);
		} else if (C.ID === 0) {
			// Player is using the item on herself
			DialogMenuButtonBuild(C);
		} else {
			// Otherwise, set the NPC's dialog
			C.CurrentDialog = DialogFind(C, "ItemDevicesCrib" + DialogFocusItem.Property.Type, "ItemArms");
		}
	}

	InventoryItemDevicesCribPageTransition("Base");
}

function InventoryItemDevicesCribParseCurrent() {
	var type = (DialogFocusItem.Property && DialogFocusItem.Property.Type) || "g0p0";
	var match = type.match(/^g(\d)p(\d)$/);
	return [Number(match[1]), Number(match[2])];
}

function InventoryItemDevicesCribMergeOptions(g, p) {
	var gate = InventoryItemDevicesCribGateOptions[g];
	var plushie = InventoryItemDevicesCribPlushieOptions[p];
	return [gate, plushie].reduce((prop, componentProp) => {
		prop.Difficulty += (componentProp.Difficulty || 0);
		if (componentProp.IsRestraint) prop.IsRestraint = true;
			else if (!componentProp.IsRestraint && !prop.IsRestraint) prop.IsRestraint = false;
		if (componentProp.Effect) InventoryItemDevicesCribAddToArray(prop.Effect, componentProp.Effect);
		return prop;
	}, {
		Type: `g${g}p${p}`,
		Difficulty: 0,
		IsRestraint: false,
		Effect: []
	});
}

function InventoryItemDevicesCribAddToArray(dest, src) {
	src.forEach(item => {
		if (!dest.includes(item)) dest.push(item);
	});
}

function InventoryItemDevicesCribChatRoomMessage(componentName) {
	var C = CharacterGetCurrent();
	var msg = "ItemDevicesCribSet" + componentName;
	var dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, false, dictionary);
}

"use strict";

function InventoryItemButtBunnyTailVibePlugLoad() {
	VibratorModeLoad([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtBunnyTailVibePlugDraw() {
	VibratorModeDraw([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function InventoryItemButtBunnyTailVibePlugClick() {
	VibratorModeClick([VibratorModeSet.STANDARD, VibratorModeSet.ADVANCED]);
}

function AssetsItemButtBunnyTailVibePlugScriptDraw(data) {
	VibratorModeScriptDraw(data);
}

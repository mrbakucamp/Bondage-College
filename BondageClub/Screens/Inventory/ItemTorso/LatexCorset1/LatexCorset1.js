"use strict";
<<<<<<< HEAD
var InventoryItemTorsoLatexCorset1Options = [
	{
		Name: "Garter",
		Property: {
			Type: null,
		},
	},
	{
		Name: "NoGarter",
		Property: {
			Type: "Garterless",
		},
	},
];

// Loads the item extension properties
function InventoryItemTorsoLatexCorset1Load(IsCloth) {
	if(IsCloth == null) IsCloth = false;
	ExtendedItemLoad(InventoryItemTorsoLatexCorset1Options, "SelectStyle");
}

// Draw the item extension screen
function InventoryItemTorsoLatexCorset1Draw(IsCloth) {
	if(IsCloth == null) IsCloth = false;
	ExtendedItemDraw(InventoryItemTorsoLatexCorset1Options, "StyleType", null, true, IsCloth);
=======

// Loads the item extension properties
function InventoryItemTorsoLatexCorset1Load() {
	InventoryCorsetLatexCorset1Load();
}

// Draw the item extension screen
function InventoryItemTorsoLatexCorset1Draw() {
	InventoryCorsetLatexCorset1Draw(false);
>>>>>>> upstream/master
}

// Catches the item extension clicks
function InventoryItemTorsoLatexCorset1Click(IsCloth) {
<<<<<<< HEAD
	if(IsCloth == null) IsCloth = false;
	ExtendedItemClick(InventoryItemTorsoLatexCorset1Options, IsCloth);
}
=======
	InventoryCorsetLatexCorset1Click(false);
}
>>>>>>> upstream/master

"use strict";
var InventoryItemNeckAccessoriesCustomCollarTagAllowedChars = /^[a-zA-Z0-9 ~!]*$/gm;
// Loads the item extension properties
function InventoryItemNeckAccessoriesCustomCollarTagLoad() {
    var C = CharacterGetCurrent();
	var MustRefresh = false;
	
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
	if (DialogFocusItem.Property.Text == null) {
		DialogFocusItem.Property.Text = "Tag";
		MustRefresh = true;
	}
	if (MustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	
	// Only create the inputs if the item isn't locked
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		ElementCreateInput("TagText", "text", DialogFocusItem.Property.Text, "9");
	}
}

// Draw the extension screen
function InventoryItemNeckAccessoriesCustomCollarTagDraw() {
	// Draw the header and item
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

    // Tag data
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		ElementPosition("TagText", 1375, 680, 250);
		DrawButton(1500, 651, 350, 64, DialogFindPlayer("CustomTagText"), ElementValue("TagText").match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars) ? "White" : "#888", "");
	} else {
		DrawText(DialogFindPlayer("SelectCollarNameTagTypeLocked"), 1500, 500, "white", "gray");
    }
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesCustomCollarTagClick() {
	
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		// Change values if they are different and the tag is not locked
		if ((MouseX >= 1500) && (MouseX <= 1850)) {
			// Changes the text
			if ((MouseY >= 671) && (MouseY <= 735) && DialogFocusItem.Property.Text !== ElementValue("TagText") && ElementValue("TagText").match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars)) {
				DialogFocusItem.Property.Text = ElementValue("TagText");
				InventoryItemNeckAccessoriesCustomCollarTagChange();
			}
		}
	}
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckAccessoriesCustomCollarTagExit();
	}
}

// Leaves the extended screen
function InventoryItemNeckAccessoriesCustomCollarTagExit() {
	ElementRemove("TagText");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

// When the tag is changed
function InventoryItemNeckAccessoriesCustomCollarTagChange() { 
    var C = CharacterGetCurrent();
    CharacterRefresh(C);
    if (CurrentScreen == "ChatRoom") {
        var Dictionary = [];
        Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
        Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
        ChatRoomPublishCustomAction("ChangeCustomTag", true, Dictionary);
		InventoryItemNeckAccessoriesCustomCollarTagExit();
    }
}

// Drawing function for the text on the tag
function AssetsItemNeckAccessoriesCustomCollarTagAfterDraw({
    C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) { 
	if (L === "_Text") {
		// We set up a canvas
		const Height = 50;
		const Width = 45;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);
    
		// We draw the desired info on that canvas
		let context = TempCanvas.getContext('2d');
		context.font = "14px serif";
		context.fillStyle = Color;
		context.textAlign = "center";
		context.fillText((Property && Property.Text.match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars) ? Property.Text : "Tag"), Width / 2, Width / 2, Width);
    
		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 227.5, Y + 30, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 227.5, Y + 30, AlphaMasks);
	}
}

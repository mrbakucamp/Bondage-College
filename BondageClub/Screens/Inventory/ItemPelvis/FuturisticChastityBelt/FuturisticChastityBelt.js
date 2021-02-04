"use strict";
var FuturisticChastityBeltShockCooldownOrgasm = 15000 // 15 sec
<<<<<<< HEAD
var FuturisticChastityBeltShockCooldownTamper = 1000 // 1 sec
var FuturisticChastityBeltShockCooldownStruggle = 30000 // 30 sec
=======
>>>>>>> upstream/master

var InventoryItemPelvisFuturisticChastityBeltTamperZones = [
	"ItemPelvis",
	"ItemButt",
	"ItemVulva",
]
var InventoryItemPelvisFuturisticChastityBeltOptions = [	
	{
		Name: "OpenBack",
		Property: {
			Type: null,
			Block: ["ItemVulva", "ItemVulvaPiercings"],
		},
	},
	{
		Name: "OpenFront",
		Property: {
			Type: "OpenFront",
			Block: ["ItemButt"],
		},
	},
	{
		Name: "ClosedBack",
		Property: {
			Type: "ClosedBack",
			Block: ["ItemButt", "ItemVulvaPiercings", "ItemVulva"],
		},
	},
];


function InventoryItemPelvisFuturisticChastityBeltLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied()
	} else{
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = { NextShockTime: 0, PunishStruggle: false , PunishStruggleOther: false , PunishOrgasm: false, ChatMessage: false,  CloseBack: false, };
		if (DialogFocusItem.Property.NextShockTime == null) DialogFocusItem.Property.NextShockTime = 0;
		if (DialogFocusItem.Property.PunishStruggle == null) DialogFocusItem.Property.PunishStruggle = false;
		if (DialogFocusItem.Property.PunishStruggleOther == null) DialogFocusItem.Property.PunishStruggleOther = false;
		if (DialogFocusItem.Property.PunishOrgasm == null) DialogFocusItem.Property.PunishOrgasm = false;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = false;
	}
}

function InventoryItemPelvisFuturisticChastityBeltDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else if (DialogFocusItem && DialogFocusItem.Property) {
		
		DrawRect(1387, 125, 225, 275, "white");
		DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1389, 127, 221, 221);
		DrawTextFit(DialogFocusItem.Asset.Description, 1500, 375, 221, "black");
		
		if (DialogFocusItem.Property.NextShockTime - CurrentTime > 0)
			DrawText(DialogFind(Player, "FuturisticChastityBeltTime") + " " + TimerToString(DialogFocusItem.Property.NextShockTime - CurrentTime), 1500, 475, "White", "Gray");
		else
			DrawText(DialogFind(Player, "FuturisticChastityBeltTimeReady"), 1500, 475, "White", "Gray");
			
		
		MainCanvas.textAlign = "left";
		DrawCheckboxColor(1100, 550, 64, 64, DialogFind(Player, "FuturisticChastityBeltPunishChatMessage"), DialogFocusItem.Property.ChatMessage, "White");
		DrawCheckboxColor(1100, 620, 64, 64, DialogFind(Player, "FuturisticChastityBeltPunishStruggle"), DialogFocusItem.Property.PunishStruggle, "White");
		DrawCheckboxColor(1100, 690, 64, 64, DialogFind(Player, "FuturisticChastityBeltPunishStruggleOther"), DialogFocusItem.Property.PunishStruggleOther, "White");
		DrawCheckboxColor(1100, 760, 64, 64, DialogFind(Player, "FuturisticChastityBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, "White");
		MainCanvas.textAlign = "center";

		if (DialogFocusItem.Property.Type != null) {
			DrawButton(1225, 910, 150, 64, DialogFind(Player, "FuturisticChastityBeltOpenBack"), "White", "");
		} 
		if (DialogFocusItem.Property.Type != "OpenFront") {
			DrawButton(1425, 910, 150, 64, DialogFind(Player, "FuturisticChastityBeltOpenFront"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "ClosedBack") {
			DrawButton(1625, 910, 150, 64, DialogFind(Player, "FuturisticChastityBeltClosedBack"), "White", "");
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else if (DialogFocusItem && DialogFocusItem.Property) {
		DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

		/*if (DialogFocusItem.Property.NextShockTime - CurrentTime > 0)
			DrawText(DialogFindPlayer("FuturisticChastityBeltTime") + " " + TimerToString(DialogFocusItem.Property.NextShockTime - CurrentTime), 1500, 475, "White", "Gray");
		else
			DrawText(DialogFindPlayer("FuturisticChastityBeltTimeReady"), 1500, 475, "White", "Gray");*/


		MainCanvas.textAlign = "left";
		DrawCheckboxColor(1100, 550, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishChatMessage"), DialogFocusItem.Property.ChatMessage, "White");
		DrawCheckboxColor(1100, 620, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggle"), DialogFocusItem.Property.PunishStruggle, "White");
		DrawCheckboxColor(1100, 690, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggleOther"), DialogFocusItem.Property.PunishStruggleOther, "White");
		DrawCheckboxColor(1100, 760, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, "White");
		MainCanvas.textAlign = "center";

		if (DialogFocusItem.Property.Type != null) {
			DrawButton(1225, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltOpenBack"), "White", "");
		} 
		if (DialogFocusItem.Property.Type != "OpenFront") {
			DrawButton(1425, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltOpenFront"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "ClosedBack") {
			DrawButton(1625, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltClosedBack"), "White", "");
>>>>>>> upstream/master
		}

		
	}
	
}

function InventoryItemPelvisFuturisticChastityBeltClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
<<<<<<< HEAD
	if (!InventoryItemMouthFuturisticPanelGagValidate(C)) {
=======
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
>>>>>>> upstream/master
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticChastityBeltExit()
		
		if (MouseIn(1100, 550, 64, 64)) {
			DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage
		} else if (MouseIn(1100, 620, 64, 64)) {
			DialogFocusItem.Property.PunishStruggle = !DialogFocusItem.Property.PunishStruggle
			InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishStruggle", DialogFocusItem.Property.PunishStruggle)
		} else if (MouseIn(1100, 690, 64, 64)) {
			DialogFocusItem.Property.PunishStruggleOther = !DialogFocusItem.Property.PunishStruggleOther
			InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishStruggleOther", DialogFocusItem.Property.PunishStruggleOther)
		} else if (MouseIn(1100, 760, 64, 64)) {
			DialogFocusItem.Property.PunishOrgasm = !DialogFocusItem.Property.PunishOrgasm
			InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishOrgasm", DialogFocusItem.Property.PunishOrgasm)
		} else if (MouseIn(1200, 910, 600, 64)) {
			if (MouseIn(1225, 910, 150, 64) && DialogFocusItem.Property.Type != null) {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[0], false)
			} 
			if (MouseIn(1425, 910, 150, 64) && DialogFocusItem.Property.Type != "OpenFront") {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[1], false)
			}
			if (MouseIn(1625, 910, 150, 64) && DialogFocusItem.Property.Type != "ClosedBack") {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[2], false)
			}

		} 
		
		
		
	}
}

function InventoryItemPelvisFuturisticChastityBeltExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
}

function InventoryItemPelvisFuturisticChastityBeltPublishAction(C, Option) {

	var msg = "FuturisticChastityBeltSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
} 

function InventoryItemPelvisFuturisticChastityBeltPublishMode(C, Setting, Active) { 
	var msg = "FuturisticChastityBeltSet" + Setting + ((Active) ? "On" : "Off");
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisFuturisticChastityBeltValidate(C) { 
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}




function InventoryItemPelvisFuturisticChastityBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }


function AssetsItemPelvisFuturisticChastityBeltScriptUpdatePlayer(data) {
	var Item = data.Item
<<<<<<< HEAD
	if (Item.Property.NextShockTime - CurrentTime <= 0) {
		// Punish the player if they try to mess with the groin area
		if (Item.Property.PunishStruggle && Player.FocusGroup && DialogProgress >= 0 && DialogProgressPrevItem != null && DialogProgressStruggleCount > 0) {
			var inFocus = false
			for (var Z = 0; Z < InventoryItemPelvisFuturisticChastityBeltTamperZones.length; Z++)
				if (Player.FocusGroup.Name == InventoryItemPelvisFuturisticChastityBeltTamperZones[Z])
					inFocus = true
			
			if (inFocus) {
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Struggle")
				Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownTamper // Very quick cooldown. Can't have players taking off their chastity belt easily~
				DialogProgressStruggleCount = 0
				DialogLeaveDueToItem = true
				/*var vol = 1
				if (Player.AudioSettings && Player.AudioSettings.Volume) {
					vol = Player.AudioSettings.Volume
				}
				AudioPlayInstantSound("Audio/Shocks.mp3", vol)*/
			}
		}
		// Punish the player if they struggle anywhere
		if (Item.Property.PunishStruggleOther && Player.FocusGroup && DialogProgressPrevItem != null && DialogProgressStruggleCount > 0 && DialogProgress > 50) {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "StruggleOther")
			Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownStruggle // Longer cooldown to allow some possibilty of kinky escape
			DialogProgressStruggleCount = 0
			DialogProgress = 0
			DialogLeaveDueToItem = true

		}
=======
	// Punish the player if they try to mess with the groin area
	if (Item.Property.PunishStruggle && Player.FocusGroup && (DialogProgress >= 0 || DialogLockPickProgressCurrentTries > 0) && DialogProgressPrevItem != null && DialogProgressStruggleCount > 0) {
		var inFocus = false
		for (var Z = 0; Z < InventoryItemPelvisFuturisticChastityBeltTamperZones.length; Z++)
			if (Player.FocusGroup.Name == InventoryItemPelvisFuturisticChastityBeltTamperZones[Z])
				inFocus = true
		
		if (inFocus) {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Struggle")
			DialogProgressStruggleCount = 0
			DialogLeaveDueToItem = true
			/*var vol = 1
			if (Player.AudioSettings && Player.AudioSettings.Volume) {
				vol = Player.AudioSettings.Volume
			}
			AudioPlayInstantSound("Audio/Shocks.mp3", vol)*/
		}
	}
	// Punish the player if they struggle anywhere
	if (Item.Property.PunishStruggleOther && Player.FocusGroup && DialogProgressPrevItem != null && DialogProgressStruggleCount > 0 && (DialogProgress > 50 || DialogLockPickProgressCurrentTries > 2)) {
		AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "StruggleOther")
		DialogProgressStruggleCount = 0
		DialogProgress = 0
		DialogLeaveDueToItem = true

	}
		
	if (Item.Property.NextShockTime - CurrentTime <= 0) {
>>>>>>> upstream/master
		// Punish the player if they orgasm
		if (Item.Property.PunishOrgasm && Player.ArousalSettings && Player.ArousalSettings.OrgasmStage > 1) {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Orgasm")
			Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownOrgasm // Difficult to have two orgasms in 10 seconds
			/*var vol = 1
			if (Player.AudioSettings && Player.AudioSettings.Volume) {
				vol = Player.AudioSettings.Volume
			}
			AudioPlayInstantSound("Audio/Shocks.mp3", vol)*/
		}
	}
}
		
// Trigger a shock automatically
function AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, ShockType) { 

	if (!CurrentScreen == "ChatRoom") {
		var vol = 1
		if (Player.AudioSettings && Player.AudioSettings.Volume) {
			vol = Player.AudioSettings.Volume
		}
		AudioPlayInstantSound("Audio/Shocks.mp3", vol)
	} else {
		if (Item.Property && Item.Property.ChatMessage) {
			var Dictionary = [];
			Dictionary.push({ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({ Tag: "SourceCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({Tag: "AssetName", AssetName: Item.Asset.Name});
			Dictionary.push({ Tag: "ActivityName", Text: "ShockItem" });
			Dictionary.push({ Tag: "ActivityGroup", Text: Item.Asset.Group.Name });
			Dictionary.push({ AssetName: Item.Asset.Name });
			Dictionary.push({ AssetGroupName: Item.Asset.Group.Name });
			Dictionary.push({ Automatic: true });
				
			ServerSend("ChatRoomChat", { Content: "FuturisticChastityBeltShock" + ShockType, Type: "Action", Dictionary });
		}
	}
    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "Soft", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}


// Update data
function AssetsItemPelvisFuturisticChastityBeltScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {
		
		if (CommonTime() > property.NextShockTime) {
			AssetsItemPelvisFuturisticChastityBeltScriptUpdatePlayer(data)
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}
		
		var timeToNextRefresh = 950;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}

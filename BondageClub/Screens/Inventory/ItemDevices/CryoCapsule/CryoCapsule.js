"use strict";

var InventoryItemDevicesCryoCapsuleOptions = [
	{
		Name: "Open",
		Property: {
			Type: null,
			Difficulty:-2,
			Effect: ["Freeze"],
			SelfUnlock: true
		}
	},
	{
		Name: "Closed",
		Property: {
			Type: "Closed",
			Difficulty:4,
			Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
			SelfUnlock: false
		}
	}
];

<<<<<<< HEAD
// Loads the item extension properties
=======
/**
 * Loads the item extension properties
 * @returns {void} - Nothing
 */
>>>>>>> upstream/master
function InventoryItemDevicesCryoCapsuleLoad() {
	ExtendedItemLoad(InventoryItemDevicesCryoCapsuleOptions, "SelectCryoCapsuleType");
}

<<<<<<< HEAD
// Draw the item extension screen
=======
/**
* Draw the item extension screen
* @returns {void} - Nothing
*/
>>>>>>> upstream/master
function InventoryItemDevicesCryoCapsuleDraw() {
	ExtendedItemDraw(InventoryItemDevicesCryoCapsuleOptions, "CryoCapsuleType");
}

<<<<<<< HEAD
// Catches the item extension clicks
=======
/**
 * Catches the item extension clicks
 * @returns {void} - Nothing
 */
>>>>>>> upstream/master
function InventoryItemDevicesCryoCapsuleClick() {
	ExtendedItemClick(InventoryItemDevicesCryoCapsuleOptions);
}

<<<<<<< HEAD
function InventoryItemDevicesCryoCapsuleValidate() {
	var C = CharacterGetCurrent();
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLocked");
		Allowed = false;
=======
/**
 * Validates, if the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate error message, if not.
 * @param {Character} C - The character to validate the option for
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemDevicesCryoCapsuleValidate(C) {
	var Allowed = "";

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		Allowed = DialogFindPlayer("CantChangeWhileLocked");
>>>>>>> upstream/master
	}

	return Allowed;
}

<<<<<<< HEAD
=======
/**
 * Publishes the message to the chat
 * @param {Character} C - The target character
 * @param {Option} Option - The currently selected Option
 * @returns {void} - Nothing
 */
>>>>>>> upstream/master
function InventoryItemDevicesCryoCapsulePublishAction(C, Option) {
	var msg = "CryoCapsuleSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

<<<<<<< HEAD
=======
/**
 * The NPC dialog is for what the NPC says to you when you make a change to their restraints - the dialog lookup is on a 
 * per-NPC basis. You basically put the "AssetName" + OptionName in there to allow individual NPCs to override their default 
 * "GroupName" dialog if for example we ever wanted an NPC to react specifically to having the restraint put on them. 
 * That could be done by adding an "AssetName" entry (or entries) to that NPC's dialog CSV
 * @param {Character} C - The NPC to whom the restraint is applied
 * @param {Option} Option - The chosen option for this extended item
 * @returns {void} - Nothing
 */
>>>>>>> upstream/master
function InventoryItemDevicesCryoCapsuleNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "ItemDevicesCryoCapsule" + Option.Name, "ItemDevices");
}

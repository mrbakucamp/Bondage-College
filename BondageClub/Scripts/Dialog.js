"use strict";
var DialogText = "";
var DialogTextDefault = "";
var DialogTextDefaultTimer = -1;
var DialogProgress = -1;
var DialogColor = null;
var DialogExpressionColor = null;
var DialogColorSelect = null;
var DialogPreviousCharacterData = {};
var DialogProgressStruggleCount = 0;
var DialogProgressAuto = 0;
var DialogProgressOperation = "...";
var DialogProgressPrevItem = null;
var DialogProgressNextItem = null;
var DialogProgressSkill = 0;
var DialogProgressLastKeyPress = 0;
var DialogProgressChallenge = 0;
var DialogInventory = [];
var DialogInventoryOffset = 0;
var DialogFocusItem = null;
var DialogFocusSourceItem = null;
var DialogFocusItemColorizationRedrawTimer = null;
var DialogMenuButton = [];
var DialogItemToLock = null;
var DialogAllowBlush = false;
var DialogAllowEyebrows = false;
var DialogAllowFluids = false;
var DialogFacialExpressions = [];
var DialogFacialExpressionsSelected = -1;
<<<<<<< HEAD
=======
var DialogFacialExpressionsSelectedBlindnessLevel = 2;
>>>>>>> upstream/master
var DialogActivePoses = [];
var DialogItemPermissionMode = false;
var DialogExtendedMessage = "";
var DialogActivityMode = false;
var DialogActivity = [];
var DialogSortOrderEnabled = 1;
var DialogSortOrderEquipped = 2;
var DialogSortOrderUsable = 3;
var DialogSortOrderUnusable = 4;
var DialogSortOrderBlocked = 5;
var DialogSelfMenuSelected = null;
var DialogLeaveDueToItem = false; // This allows dynamic items to call DialogLeave() without crashing the game
<<<<<<< HEAD
=======

var DialogLockPickItem = null;
var DialogLockPickOrder = null;
var DialogLockPickSet = null;
var DialogLockPickSetFalse = null;
var DialogLockPickOffset = null;
var DialogLockPickOffsetTarget = null;
var DialogLockPickImpossiblePins = null;
var DialogLockPickProgressItem = null;
var DialogLockPickProgressOperation = "";
var DialogLockPickProgressSkill = 0;
var DialogLockPickProgressSkillLose = 0;
var DialogLockPickProgressChallenge = 0;
var DialogLockPickProgressMaxTries = 0;
var DialogLockPickProgressCurrentTries = 0;
var DialogLockPickSuccessTime = 0;
var DialogLockPickFailTime = 0;
var DialogLockPickArousalTick = 0;
var DialogLockPickArousalTickTime = 12000;
var DialogLockPickArousalText = ""
var DialogLockPickFailTimeout = 30000

var DialogLockMenu = false
var DialogLentLockpicks = false
var DialogLockPickTotalTries = 0

/** @type {Map<string, string>} */
var PlayerDialog = new Map();


>>>>>>> upstream/master
/**
 * The list of menu types available when clicking on yourself
 * @const
 * @type {Array.<object>}
 */
var DialogSelfMenuOptions = [
	{
		Name: "Expression",
		IsAvailable: () => true,
		Draw: DialogDrawExpressionMenu,
		Click: DialogClickExpressionMenu,
	},
	{
		Name: "Pose",
		IsAvailable: () => (CurrentScreen == "ChatRoom" || CurrentScreen == "Photographic"), 
		Draw: DialogDrawPoseMenu,
		Click: DialogClickPoseMenu,
	},
	{
		Name: "OwnerRules",
		IsAvailable: () => DialogSelfMenuSelected && DialogSelfMenuSelected.Name == "OwnerRules",
		Draw: DialogDrawOwnerRulesMenu,
		Click: () => {},
	},
];

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is less or equal than a given value
 */
function DialogReputationLess(RepType, Value) { return (ReputationGet(RepType) <= Value); }

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is greater or equal than a given value
 */
function DialogReputationGreater(RepType, Value) { return (ReputationGet(RepType) >= Value); }

/**
 * Compares the player's money with a given amount
 * @param {string} Amount - The amount of money that must be met
 * @returns {boolean} - Returns TRUE if the player has enough money
 */
function DialogMoneyGreater(Amount) { return (parseInt(Player.Money) >= parseInt(Amount)); }

/**
 * Changes a given player's account by a given amount
 * @param {string} Amount - The amount that should be charged or added to the player's account
 * @returns {void} - Nothing
 */
function DialogChangeMoney(Amount) { CharacterChangeMoney(Player, Amount); }

/**
 * Alters the current player's reputation by a given amount
 * @param {string} RepType - The name of the reputation to change
 * @param {string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogSetReputation(RepType, Value) { ReputationChange(RepType, (parseInt(ReputationGet(RepType)) * -1) + parseInt(Value)); } // Sets a fixed number for the player specific reputation

/**
 * Change the player's reputation progressively through dialog options (a reputation is easier to break than to build)
 * @param {string} RepType - The name of the reputation to change
 * @param {string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogChangeReputation(RepType, Value) { ReputationProgress(RepType, Value); }

/**
 * Equips a specific item on the player from dialog
 * @param {string} AssetName - The name of the asset that should be equipped
 * @param {string} AssetGroup - The name of the corresponding asset group
 * @returns {void} - Nothing
 */
function DialogWearItem(AssetName, AssetGroup) { InventoryWear(Player, AssetName, AssetGroup); }

/**
 * Equips a random item from a given group to the player from dialog
 * @param {string} AssetGroup - The name of the asset group to pick from
 * @returns {void} - Nothing
 */
function DialogWearRandomItem(AssetGroup) { InventoryWearRandom(Player, AssetGroup); }

/**
 * Removes an item of a specific item group from the player
 * @param {string} AssetGroup - The item to be removed belongs to this asset group
 * @returns {void} - Nothing
 */
function DialogRemoveItem(AssetGroup) { InventoryRemove(Player, AssetGroup); }

/**
 * Releases a character from restraints
 * @param {string} C - The character to be released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogRelease(C) { CharacterRelease((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Strips a character naked and removes the restrains
 * @param {string} C - The character to be stripped and released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogNaked(C) { CharacterNaked((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Fully restrain a character with random items
 * @param {string} C - The character to be restrained.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogFullRandomRestrain(C) { CharacterFullRandomRestrain((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Checks, if a specific log has been registered with the player
 * @param {string} LogType - The name of the log to search for
 * @param {string} LogGroup - The name of the log group
 * @returns {boolean} - Returns true, if a specific log is registered
 */
function DialogLogQuery(LogType, LogGroup) { return LogQuery(LogType, LogGroup); }

/**
 * Sets the AllowItem flag on the current character
 * @param {string} Allow - The flag to set. Either "TRUE" or "FALSE"
 * @returns {boolean} - The boolean version of the flag
 */
function DialogAllowItem(Allow) { return CurrentCharacter.AllowItem = (Allow.toUpperCase().trim() == "TRUE"); }

/**
 * Returns the value of the AllowItem flag of a given character
 * @param {string} C - The character whose flag should be returned.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - The value of the given character's AllowItem flag
 */
function DialogDoAllowItem(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.AllowItem : CurrentCharacter.AllowItem }

/**
 * Determines if the given character is kneeling
 * @param {string} C - The character to check
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is kneeling
 */
function DialogIsKneeling(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.IsKneeling() : CurrentCharacter.IsKneeling() }

/**
 * Determines if the player is owned by the current character
 * @returns {boolean} - Returns true, if the player is owned by the current character, false otherwise
 */
function DialogIsOwner() { return (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")) }

/**
 * Determines, if the current character is the player's lover
 * @returns {boolean} - Returns true, if the current character is one of the player's lovers
 */
function DialogIsLover() { return (CurrentCharacter.Name == Player.Lover.replace("NPC-", "")) }

/**
 * Determines if the current character is owned by the player
 * @returns {boolean} - Returns true, if the current character is owned by the player, false otherwise
 */
function DialogIsProperty() { return (CurrentCharacter.Owner == Player.Name) }

/**
 * Checks, if a given character is currently restrained
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing restraints, false otherwise
 */
function DialogIsRestrained(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsRestrained() : CurrentCharacter.IsRestrained()) }

/**
 * Checks, if a given character is currently blinded
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is blinded, false otherwise
 */
function DialogIsBlind(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsBlind() : CurrentCharacter.IsBlind()) }

/**
 * Checks, if a given character is currently wearing a vibrating item
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing a vibrating item, false otherwise
 */
function DialogIsEgged(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsEgged() : CurrentCharacter.IsEgged()) }

/**
 * Checks, if a given character is able to change her clothes
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is able to change clothes, false otherwise
 */
function DialogCanInteract(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.CanInteract() : CurrentCharacter.CanInteract()) }

/**
 * Sets a new pose for the given character
 * @param {string} C - The character whose pose should be altered.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @param {string} [NewPose=null] - The new pose, the character should take.
 * Can be omitted to bring the character back to the standing position.
 * @returns {void} - Nothing
 */
function DialogSetPose(C, NewPose) { CharacterSetActivePose((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter, ((NewPose != null) && (NewPose != "")) ? NewPose : null, true) }

/**
 * CHecks, wether a given skill of the player is greater or equal a given value
 * @param {string} SkillType - Name of the skill to check
 * @param {string} Value - The value, the given skill must be compared to
 * @returns {boolean} - Returns true if a specific skill is greater or equal than a given value
 */
function DialogSkillGreater(SkillType, Value) { return (parseInt(SkillGetLevel(Player, SkillType)) >= parseInt(Value)) }

/**
 * Cheks, if a given item is available in the player's inventory
 * @param {string} InventoryName
 * @param {string} InventoryGroup
 * @returns {boolean} - Returns true, if the item is available, false otherwise
 */
function DialogInventoryAvailable(InventoryName, InventoryGroup) { return InventoryAvailable(Player, InventoryName, InventoryGroup) }

/**
 * Checks, if the player is the administrator of the current chat room
 * @returns {boolean} - Returns true, if the player belogs to the group of administrators for the current char room false otherwise
 */
function DialogChatRoomPlayerIsAdmin() { return (ChatRoomPlayerIsAdmin() && (CurrentScreen == "ChatRoom")) }

/**
 * Checks, if a safe word can be used.
 * @returns {boolean} - Returns true, if the player is currently within a chat room
 */
function DialogChatRoomCanSafeword() { return (CurrentScreen == "ChatRoom" && Player.GameplaySettings.EnableSafeword) }

/**
 * Checks if the player is currently owned.
 * @returns {boolean} - Returns true, if the player is currently owned by an online player (not in trial)
 */
function DialogCanViewRules() { return (Player.Ownership != null) && (Player.Ownership.Stage == 1) }

/**
 * Checks the prerequisite for a given dialog
 * @param {number} D - Index of the dialog to check
 * @returns {boolean} - Returns true, if the prerequisite is met, false otherwise
 */
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else
		if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Player.") == 0)
			return Player[CurrentCharacter.Dialog[D].Prerequisite.substring(7, 250).replace("()", "").trim()]();
		else
			if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!Player.") == 0)
				return !Player[CurrentCharacter.Dialog[D].Prerequisite.substring(8, 250).replace("()", "").trim()]();
			else
				if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("CurrentCharacter.") == 0)
					return CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(17, 250).replace("()", "").trim()]();
				else
					if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!CurrentCharacter.") == 0)
						return !CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(18, 250).replace("()", "").trim()]();
					else
						if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("(") >= 0)
							return CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Prerequisite);
						else
							if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
								return window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.trim()];
							else
								return !window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250).trim()];
}

/**
 * Checks whether the player has a key for the item
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item with a key, false otherwise
 */
function DialogHasKey(C, Item) {
	if (InventoryGetItemProperty(Item, "SelfUnlock") == false && (!Player.CanInteract() || C.ID == 0)) return false;
	if (C.IsOwnedByPlayer() && InventoryAvailable(Player, "OwnerPadlockKey", "ItemMisc") && Item.Asset.Enable) return true;
	if (InventoryGetLock(Item) && InventoryGetLock(Item).Asset.ExclusiveUnlock && ((!Item.Property.MemberNumberListKeys && Item.Property.LockMemberNumber != Player.MemberNumber) || (Item.Property.MemberNumberListKeys && CommonConvertStringToArray("" + Item.Property.MemberNumberListKeys).indexOf(Player.MemberNumber) < 0))) return false;
	if (C.IsLoverOfPlayer() && InventoryAvailable(Player, "LoversPadlockKey", "ItemMisc") && Item.Asset.Enable && Item.Property && !Item.Property.LockedBy.startsWith("Owner")) return true;

    if (InventoryGetLock(Item).Asset.ExclusiveUnlock) return true;

	var UnlockName = "Unlock-" + Item.Asset.Name;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy != null)) UnlockName = "Unlock-" + Item.Property.LockedBy;
	for (let I = 0; I < Player.Inventory.length; I++)
		if (InventoryItemHasEffect(Player.Inventory[I], UnlockName)) {
			var Lock = InventoryGetLock(Item);
			if (Lock != null) {
				if (Lock.Asset.LoverOnly && !C.IsLoverOfPlayer()) return false;
				if (Lock.Asset.OwnerOnly && !C.IsOwnedByPlayer()) return false;
				return true;
			} else return true;
		}
	return false
}

/**
 * Checks whether the player is able to unlock the provided item on the provided character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item, false otherwise
 */
function DialogCanUnlock(C, Item) {
	if ((C.ID != 0) && !Player.CanInteract()) return false;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy == "ExclusivePadlock")) return (C.ID != 0);
	if (LogQuery("KeyDeposit", "Cell")) return false;
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.OwnerOnly == true)) return Item.Asset.Enable && C.IsOwnedByPlayer();
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.LoverOnly == true)) return Item.Asset.Enable && C.IsLoverOfPlayer();

	return DialogHasKey(C, Item);
}

/**
 * Some specific screens like the movie studio cannot allow the player to use items on herself, return FALSE if it's the case
 * @returns {boolean} - Returns TRUE if we allow using items
 */
function DialogAllowItemScreenException() {
	if ((CurrentScreen == "MovieStudio") && (MovieStudioCurrentMovie != "")) return false;
	return true;
}

/**
 * Some specific screens like the movie studio cannot allow the player to use items on herself, return FALSE if it's the case
 * @returns {boolean} - Returns TRUE if we allow using items
 */
function DialogAllowItemScreenException() {
	if ((CurrentScreen == "MovieStudio") && (MovieStudioCurrentMovie != "")) return false;
	return true;
}

/**
 * Returns the current character dialog intro
 * @returns {string} - The name of the current dialog, if such a dialog exists, any empty string otherwise
 */
function DialogIntro() {
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D))
			return CurrentCharacter.Dialog[D].Result;
	return "";
}


/**
 * Generic dialog function to leave conversation. De-inititalizes global variables and reverts the
 * FocusGroup of the player and the current character to null
 * @returns {void} - Nothing
 */
function DialogLeave() {
	if (DialogItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
	DialogLeaveFocusItem();
	DialogItemPermissionMode = false;
	DialogActivityMode = false;
	DialogItemToLock = null;
	Player.FocusGroup = null;
<<<<<<< HEAD
	if (CurrentCharacter)
		CurrentCharacter.FocusGroup = null;
=======
	if (CurrentCharacter) {
		if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber) {
			CharacterAppearanceForceUpCharacter = 0;
			CharacterAppearanceSetHeightModifiers(CurrentCharacter);
		}
		CurrentCharacter.FocusGroup = null;
	}
>>>>>>> upstream/master
	DialogInventory = null;
	CurrentCharacter = null;
	DialogSelfMenuSelected = null;
	DialogFacialExpressionsSelected = -1;
<<<<<<< HEAD
=======
	ClearButtons();
>>>>>>> upstream/master
}

/**
 * Generic dialog function to remove a piece of the conversation that's already done
 * @returns {void} - Nothing
 */
function DialogRemove() {
	var pos = 0;
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
			if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {
				CurrentCharacter.Dialog.splice(D, 1);
				break;
			}
			pos++;
		}
}

/**
 * Generic dialog function to remove any dialog from a specific group
 * @param {string} GroupName - All dialog options are removed from this group
 * @returns {void} - Nothing
 */
function DialogRemoveGroup(GroupName) {
	GroupName = GroupName.trim().toUpperCase();
	for (let D = CurrentCharacter.Dialog.length - 1; D >= 0; D--)
		if ((CurrentCharacter.Dialog[D].Group != null) && (CurrentCharacter.Dialog[D].Group.trim().toUpperCase() == GroupName)) {
			CurrentCharacter.Dialog.splice(D, 1);
		}
}

/**
 * Generic function that sets timers for expression changes, if the player'S expressions have been altered by the dialog
 * @returns {void} - Nothing
 */
function DialogEndExpression() {
	if (DialogAllowBlush) {
		TimerInventoryRemoveSet(Player, "Blush", 15);
		DialogAllowBlush = false;
	}
	if (DialogAllowEyebrows) {
		TimerInventoryRemoveSet(Player, "Eyebrows", 5);
		DialogAllowEyebrows = false;
	}
	if (DialogAllowFluids) {
		TimerInventoryRemoveSet(Player, "Fluids", 5);
		DialogAllowFluids = false;
	}
}

/**
 * Leaves the item menu for both characters. De-initializes global variables, sets the FocusGroup of
 * player andd current character to null and calls various cleanup functions
 * @returns {void} - Nothing
 */
function DialogLeaveItemMenu() {
	DialogEndExpression();
	DialogItemToLock = null;
	Player.FocusGroup = null;
<<<<<<< HEAD
	if (CurrentCharacter)
		CurrentCharacter.FocusGroup = null;
=======
	if (CurrentCharacter) {
		CurrentCharacter.FocusGroup = null;
	}
>>>>>>> upstream/master
	DialogInventory = null;
	DialogProgress = -1;
	DialogLockMenu = false
	DialogLockPickOrder = null;
	DialogColor = null;
	DialogMenuButton = [];
	if (DialogItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
	DialogItemPermissionMode = false;
	DialogActivityMode = false;
	DialogTextDefault = "";
	DialogTextDefaultTimer = 0;
	DialogPreviousCharacterData = {};
	ElementRemove("InputColor");
	AudioDialogStop();
	ColorPickerEndPick();
	ColorPickerRemoveEventListener();
	ItemColorCancelAndExit();
}

/**
 * Leaves the item menu of the focused item. Constructs a function name from the
 * item's asset group name and the item's name and tries to call that.
 * @returns {boolean} - Returns true, if an item specific exit function was called, false otherwise
 */
function DialogLeaveFocusItem() {
	if (DialogFocusItem != null) {
		if (DialogFocusItem.Asset.Extended) {
			ExtendedItemExit();
		}

		var funcName = "Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Exit";
		if (typeof window[funcName] === "function") {
			window[funcName]();
			DialogFocusItem = null;
			return true;
		}
		DialogFocusItem = null;
	}
	return false;
}

/**
 * Adds the item in the dialog list
 * @param {Character} C - The character, whose inventory should be manipulated
 * @param {Item} NewInv - The item that should be added to the player's inventory
 * @param {boolean} NewInvWorn - Should be true, if the item is worn, false otherwise
 * @param {number} SortOrder - Defines the group the item is added to.
 * @returns {void} - Nothing
 */
function DialogInventoryAdd(C, NewInv, NewInvWorn, SortOrder) {

	// Make sure we do not add owner/lover only items for invalid characters, owner/lover locks can be applied on the player by the player for self-bondage
	if (NewInv.Asset.OwnerOnly && !NewInvWorn && !C.IsOwnedByPlayer())
		if ((C.ID != 0) || ((C.Owner == "") && (C.Ownership == null)) || !NewInv.Asset.IsLock || ((C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")))
			return;
	if (NewInv.Asset.LoverOnly && !NewInvWorn && !C.IsLoverOfPlayer()) {
		if (!NewInv.Asset.IsLock || C.GetLoversNumbers(true).length == 0) return;
		if (C.ID == 0) {
			if (LogQuery("BlockLoverLockSelf", "LoverRule")) return;
		}
		else if (!C.IsOwnedByPlayer() || LogQueryRemote(C, "BlockLoverLockOwner", "LoverRule")) return;
	}


	// Do not show keys if they are in the deposit
	if (LogQuery("KeyDeposit", "Cell") && InventoryIsKey(NewInv)) return;

	// Make sure we do not duplicate the non-blocked item
	for (let I = 0; I < DialogInventory.length; I++)
		if ((DialogInventory[I].Asset.Group.Name == NewInv.Asset.Group.Name) && (DialogInventory[I].Asset.Name == NewInv.Asset.Name))
			return;

	// If the item is blocked, we show it at the end of the list
<<<<<<< HEAD
	if (InventoryIsPermissionBlocked(C, NewInv.Asset.DynamicName(Player), NewInv.Asset.DynamicGroupName) || !InventoryCheckLimitedPermission(C, NewInv))
=======
	if (InventoryBlockedOrLimited(C, NewInv))
>>>>>>> upstream/master
		SortOrder = DialogSortOrderBlocked;

	// Creates a new dialog inventory item
	var DI = {
		Asset: NewInv.Asset,
		Worn: NewInvWorn,
		Icon: "",
		SortOrder: SortOrder.toString() + NewInv.Asset.Description
	};

	// Loads the correct icon and push the item in the array
	if (NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Locked";
	if (!NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Unlocked";
	DialogInventory.push(DI);

}

/**
 * Some special screens can always allow you to put on new restraints. This function determines, if this is possible
 * @returns {boolean} - Returns trues, if it is possible to put on new restraints.
 */
function DialogAlwaysAllowRestraint() {
	return (CurrentScreen == "Photographic");
}

/**
 * Checks whether the player can use a remote on the given character and item
 * @param {Character} C - the character that the item is equipped on
 * @param {Item} Item - the item to check for remote usage against
 * @return {boolean} - Returns true if the player is able to use a remote for the given character and item. Returns false otherwise.
 */
function DialogCanUseRemote(C, Item) {
	// Can't use remotes if there is no item, the item doesn't have the "Egged" effect, or the player cannot interact
	// with remotes in the first place
	if (!Item || !InventoryItemHasEffect(Item, "Egged") || !Player.CanInteract()) return false;
	// Can't use remotes on self if the player is owned and their remotes have been blocked by an owner rule
	if (C.ID === 0 && Player.Ownership && Player.Ownership.Stage === 1 && LogQuery("BlockRemoteSelf", "OwnerRule")) return false;
	if (Item.Asset.LoverOnly) {
		// If the item is lover-only, the player must have the appropriate remote, be a lover of the character, and match the member number on the item
		return C.IsLoverOfPlayer() && Item.Property && Item.Property.ItemMemberNumber === Player.MemberNumber && InventoryAvailable(Player, "LoversVibratorRemote", "ItemVulva");
	} else {
		
		// Otherwise, the player must have a vibrator remote and some items can block remotes
		if (C.Effect.indexOf("BlockRemotes") >= 0) return false;	
		return InventoryAvailable(Player, "VibratorRemote", "ItemVulva");
	}
}

/**
 * Checks whether the player can color the given item on the given character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item to check the player's ability to color against
 * @returns {boolean} - TRUE if the player is able to color the item, FALSE otherwise
 */
function DialogCanColor(C, Item) {
	const ItemColorable = !Item || (Item && Item.Asset && Item.Asset.ColorableLayerCount > 0);
	const CanUnlock = InventoryItemHasEffect(Item, "Lock", true) ? DialogCanUnlock(C, Item) : true;
	return (Player.CanInteract() && CanUnlock && ItemColorable) || DialogAlwaysAllowRestraint();
}

/**
 * Build the buttons in the top menu
 * @param {Character} C - The character for whom the dialog is prepared
 * @returns {void} - Nothing
 */
function DialogMenuButtonBuild(C) {

	// The "Exit" button is always available
	DialogMenuButton = ["Exit"];

	var Item = InventoryGet(C, C.FocusGroup.Name);
	// In color picker mode
	if (DialogColor != null && Item == null) {
		DialogMenuButton.push("ColorCancel");
		DialogMenuButton.push("ColorSelect");
		return;
	}
	if (DialogLockPickOrder)
		DialogMenuButton.push("LockCancel");

	// Out of struggle mode, we calculate which buttons to show in the UI
	if ((DialogProgress < 0) && !DialogLockPickOrder && !DialogActivityMode) {

		// Pushes all valid main buttons, based on if the player is restrained, has a blocked group, has the key, etc.
		var IsItemLocked = InventoryItemHasEffect(Item, "Lock", true);
		var IsGroupBlocked = InventoryGroupIsBlocked(C);
<<<<<<< HEAD
		if ((DialogInventory != null) && (DialogInventory.length > 12) && ((Player.CanInteract() && !IsGroupBlocked) || DialogItemPermissionMode)) DialogMenuButton.push("Next");
		if (C.FocusGroup.Name == "ItemMouth" || C.FocusGroup.Name == "ItemMouth2" || C.FocusGroup.Name == "ItemMouth3") DialogMenuButton.push("ChangeLayersMouth");
		if (IsItemLocked && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())) { DialogMenuButton.push("Unlock"); DialogMenuButton.push("Remove"); }
		if ((Item != null) && (C.ID == 0) && !Player.CanInteract() && InventoryItemHasEffect(Item, "Block", true) && IsItemLocked && DialogCanUnlock(C, Item) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Unlock");
		if ((Item != null) && (C.ID == 0) && (!Player.CanInteract() || (IsItemLocked && !DialogCanUnlock(C, Item))) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Struggle");
		if (IsItemLocked && !Player.IsBlind() && (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy != "")) DialogMenuButton.push("InspectLock");
		if ((Item != null) && !IsItemLocked && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) {
			if (Item.Asset.AllowLock && (!Item.Property || (Item.Property && Item.Property.AllowLock !== false))) {
				if (!Item.Asset.AllowLockType || Item.Asset.AllowLockType.includes(Item.Property.Type)) {
					DialogMenuButton.push("Lock");
				}
			}
		}
		if ((Item != null) && !IsItemLocked && !InventoryItemHasEffect(Item, "Mounted", true) && !InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Remove");
		if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Mounted", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Dismount");
		if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Escape");
		if (DialogCanUseRemote(C, Item)) DialogMenuButton.push("Remote");
		if ((Item != null) && Item.Asset.Extended && ((Player.CanInteract()) || DialogAlwaysAllowRestraint() || Item.Asset.AlwaysInteract) && (!IsGroupBlocked || Item.Asset.AlwaysExtend) && (!Item.Asset.OwnerOnly || (C.IsOwnedByPlayer())) && (!Item.Asset.LoverOnly || (C.IsLoverOfPlayer()))) DialogMenuButton.push("Use");
		if (DialogCanColor(C, Item)) DialogMenuButton.push("ColorPick");

		// Make sure the target player zone is allowed for an activity
		if ((C.FocusGroup.Activity != null) && ((!C.IsEnclose() && !Player.IsEnclose()) || C.ID == 0) && ActivityAllowed() && (C.ArousalSettings != null) && (C.ArousalSettings.Zone != null) && (C.ArousalSettings.Active != null) && (C.ArousalSettings.Active != "Inactive"))
			for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
				if ((C.ArousalSettings.Zone[Z].Name == C.FocusGroup.Name) && (C.ArousalSettings.Zone[Z].Factor != null) && (C.ArousalSettings.Zone[Z].Factor > 0)) {
					ActivityDialogBuild(C);
					if (DialogActivity.length > 0) DialogMenuButton.push("Activity");
				}

		// Item permission enter/exit, cannot be done in Extreme mode
		if (C.ID == 0) {
			if (DialogItemPermissionMode) DialogMenuButton.push("DialogNormalMode");
			else if (Player.GetDifficulty() <= 2) DialogMenuButton.push("DialogPermissionMode");
		}
=======
		var CanAccessLockpicks = Player.CanInteract() || Player.CanWalk() // If the character can access her tools. Maybe in the future you will be able to hide a lockpick in your panties :>
		
>>>>>>> upstream/master

		if (DialogLockMenu) {
			DialogMenuButton.push("LockCancel");
			
			if (IsItemLocked && !Player.IsBlind() && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())
				|| ((Item != null) && (C.ID == 0) && !Player.CanInteract() && InventoryItemHasEffect(Item, "Block", true) && IsItemLocked && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked))
				DialogMenuButton.push("Unlock");
			if (IsItemLocked && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && !InventoryGroupIsBlocked(Player, "ItemHands") && InventoryItemIsPickable(Item) && (C.ID == 0 || (C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf))) {
				if (DialogLentLockpicks) 
					DialogMenuButton.push("PickLock");
				else if (CanAccessLockpicks)
					for (let I = 0; I < Player.Inventory.length; I++)
						if (Player.Inventory[I].Name == "Lockpicks") {
							DialogMenuButton.push("PickLock");
							break;
						}
			}
			if (IsItemLocked && !Player.IsBlind() && (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy != ""))
				DialogMenuButton.push("InspectLock");
			
		} else {
		  if ((DialogInventory != null) && (DialogInventory.length > 12) && ((Player.CanInteract() && !IsGroupBlocked) || DialogItemPermissionMode)) DialogMenuButton.push("Next");
				if (C.FocusGroup.Name == "ItemMouth" || C.FocusGroup.Name == "ItemMouth2" || C.FocusGroup.Name == "ItemMouth3") DialogMenuButton.push("ChangeLayersMouth");
				if (IsItemLocked && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())) {  DialogMenuButton.push("Remove"); }
				if (IsItemLocked && (!Player.IsBlind() || (InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && !InventoryGroupIsBlocked(Player, "ItemHands") && InventoryItemIsPickable(Item))  && (C.ID == 0 || (C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf)))
					&& (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy != ""))
					DialogMenuButton.push("LockMenu");
				if ((Item != null) && (C.ID == 0) && (!Player.CanInteract() || (IsItemLocked && !DialogCanUnlock(C, Item))) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Struggle");
				if ((Item != null) && !IsItemLocked && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) {
					if (Item.Asset.AllowLock && (!Item.Property || (Item.Property && Item.Property.AllowLock !== false))) {
						if (!Item.Asset.AllowLockType || Item.Asset.AllowLockType.includes(Item.Property.Type)) {
							DialogMenuButton.push("Lock");
						}
					}
				}
				if ((Item != null) && !IsItemLocked && !InventoryItemHasEffect(Item, "Mounted", true) && !InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Remove");
				if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Mounted", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Dismount");
				if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Escape");
				if (DialogCanUseRemote(C, Item)) DialogMenuButton.push("Remote");
				if ((Item != null) && Item.Asset.Extended && ((Player.CanInteract()) || DialogAlwaysAllowRestraint() || Item.Asset.AlwaysInteract) && (!IsGroupBlocked || Item.Asset.AlwaysExtend) && (!Item.Asset.OwnerOnly || (C.IsOwnedByPlayer())) && (!Item.Asset.LoverOnly || (C.IsLoverOfPlayer()))) DialogMenuButton.push("Use");
				if (DialogCanColor(C, Item)) DialogMenuButton.push("ColorPick");

				// Make sure the target player zone is allowed for an activity
				if ((C.FocusGroup.Activity != null) && ((!C.IsEnclose() && !Player.IsEnclose()) || C.ID == 0) && ActivityAllowed() && (C.ArousalSettings != null) && (C.ArousalSettings.Zone != null) && (C.ArousalSettings.Active != null) && (C.ArousalSettings.Active != "Inactive"))
					for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
						if ((C.ArousalSettings.Zone[Z].Name == C.FocusGroup.Name) && (C.ArousalSettings.Zone[Z].Factor != null) && (C.ArousalSettings.Zone[Z].Factor > 0)) {
							ActivityDialogBuild(C);
							if (DialogActivity.length > 0) DialogMenuButton.push("Activity");
						}
				

			// Item permission enter/exit, cannot be done in Extreme mode
			if (C.ID == 0) {
				if (DialogItemPermissionMode) DialogMenuButton.push("DialogNormalMode");
				else if (Player.GetDifficulty() <= 2) DialogMenuButton.push("DialogPermissionMode");
			}
		}
	}
}


/**
 * Sort the inventory list by the global variable SortOrder (a fixed number & current language description)
 * @returns {void} - Nothing
 */
function DialogInventorySort() {
	DialogInventory.sort((a, b) => (a.SortOrder > b.SortOrder) ? 1 : ((b.SortOrder > a.SortOrder) ? -1 : 0));
}

// 
/**
 * Build the inventory listing for the dialog which is what's equipped, 
 * the player's inventory and the character's inventory for that group
 * @param {Character} C - The character whose inventory must be built
 * @param {number} [Offset] - The offset to be at, if specified.
 * @returns {void} - Nothing
 */
function DialogInventoryBuild(C, Offset) {

	// Make sure there's a focused group
	DialogInventoryOffset = Offset;
	if (DialogInventoryOffset == null) DialogInventoryOffset = 0;
	DialogInventory = [];
	if (C.FocusGroup != null) {

		// First, we add anything that's currently equipped
		var CurItem = null;
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name) && C.Appearance[A].Asset.DynamicAllowInventoryAdd(C)) {
				DialogInventoryAdd(C, C.Appearance[A], true, DialogSortOrderEnabled);
				CurItem = C.Appearance[A];
				break;
			}

		// In item permission mode, we add all the enable items, except the ones already on
		if (DialogItemPermissionMode) {
			for (let A = 0; A < Asset.length; A++)
				if (Asset[A].Enable && Asset[A].Group.Name == C.FocusGroup.Name) {
					if (Asset[A].Wear) {
						if ((CurItem == null) || (CurItem.Asset.Name != Asset[A].Name) || (CurItem.Asset.Group.Name != Asset[A].Group.Name))
							DialogInventory.push({ Asset: Asset[A], Worn: false, Icon: "", SortOrder: DialogSortOrderEnabled.toString() + Asset[A].Description });
					}
					else if (Asset[A].IsLock) {
						var LockIsWorn = InventoryCharacterIsWearingLock(C, Asset[A].Name);
						DialogInventory.push({ Asset: Asset[A], Worn: LockIsWorn, Icon: "", SortOrder: DialogSortOrderEnabled.toString() + Asset[A].Description });
					}
				}

		} else {

			// Second, we add everything from the victim inventory
			for (let A = 0; A < C.Inventory.length; A++)
				if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && C.Inventory[A].Asset.DynamicAllowInventoryAdd(C)) {
					var DialogSortOrder = C.Inventory[A].Asset.DialogSortOverride != null ? C.Inventory[A].Asset.DialogSortOverride : (InventoryAllow(C, C.Inventory[A].Asset.Prerequisite, false) && InventoryChatRoomAllow(C.Inventory[A].Asset.Category)) ? DialogSortOrderUsable : DialogSortOrderUnusable;
					DialogInventoryAdd(C, C.Inventory[A], false, DialogSortOrder);
				}

			// Third, we add everything from the player inventory if the player isn't the victim
			if (C.ID != 0)
				for (let A = 0; A < Player.Inventory.length; A++)
					if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && Player.Inventory[A].Asset.DynamicAllowInventoryAdd(C)) {
						var DialogSortOrder = Player.Inventory[A].Asset.DialogSortOverride != null ? Player.Inventory[A].Asset.DialogSortOverride : (InventoryAllow(C, Player.Inventory[A].Asset.Prerequisite, false) && InventoryChatRoomAllow(Player.Inventory[A].Asset.Category)) ? DialogSortOrderUsable : DialogSortOrderUnusable;
						DialogInventoryAdd(C, Player.Inventory[A], false, DialogSortOrder);
					}

<<<<<<< HEAD
			// Fourth, we add all free items (especially useful for clothes)
			for (let A = 0; A < Asset.length; A++)
				if ((Asset[A].Group.Name == C.FocusGroup.Name) && (Asset[A].Value == 0) && Asset[A].DynamicAllowInventoryAdd(C)) {
					var DialogSortOrder = Asset[A].DialogSortOverride != null ? Asset[A].DialogSortOverride : (InventoryAllow(C, Asset[A].Prerequisite, false) && InventoryChatRoomAllow(Asset[A].Category)) ? DialogSortOrderUsable : DialogSortOrderUnusable;
					DialogInventoryAdd(C, { Asset: Asset[A] }, false, DialogSortOrder);
=======
			// Fourth, we add all free items (especially useful for clothes), or location-specific always available items
			for (let A = 0; A < Asset.length; A++) {
				if (Asset[A].Group.Name === C.FocusGroup.Name && Asset[A].DynamicAllowInventoryAdd(C)) {
					if (Asset[A].Value === 0 || (Asset[A].AvailableLocations.includes("Asylum") && (CurrentScreen.startsWith("Asylum") || ChatRoomSpace === "Asylum"))) {
						var DialogSortOrder = Asset[A].DialogSortOverride != null ? Asset[A].DialogSortOverride :
							(InventoryAllow(C, Asset[A].Prerequisite, false) && InventoryChatRoomAllow(Asset[A].Category)) ?
								DialogSortOrderUsable : DialogSortOrderUnusable;
						DialogInventoryAdd(C, { Asset: Asset[A] }, false, DialogSortOrder);
					}
>>>>>>> upstream/master
				}
			}
		}

		// Rebuilds the dialog menu and it's buttons
		DialogInventorySort();
		DialogMenuButtonBuild(C);

	}
}

/**
 * Build the initial state of the selection available in the facial expressions menu
 * @returns {void} - Nothing
 */
function DialogFacialExpressionsBuild() {
	DialogFacialExpressions = [];
	for (let I = 0; I < Player.Appearance.length; I++) {
		const PA = Player.Appearance[I];
		let ExpressionList = PA.Asset.Group.AllowExpression;
		if (!ExpressionList || !ExpressionList.length || PA.Asset.Group.Name == "Eyes2") continue;
		ExpressionList = ExpressionList.slice();
		if (!ExpressionList.includes(null)) ExpressionList.unshift(null);
		const Item = {};
		Item.Appearance = PA;
		Item.Group = PA.Asset.Group.Name;
		Item.CurrentExpression = (PA.Property == null) ? null : PA.Property.Expression;
		Item.ExpressionList = ExpressionList;
		DialogFacialExpressions.push(Item);
	}
	// Temporary (?) solution to make the facial elements appear in a more logical order, as their alphabetical order currently happens to match up
	DialogFacialExpressions = DialogFacialExpressions.sort(function (a, b) {
		return a.Appearance.Asset.Group.Name < b.Appearance.Asset.Group.Name ? -1 : a.Appearance.Asset.Group.Name > b.Appearance.Asset.Group.Name ? 1 : 0;
	});
}

/**
 * Build the initial state of the pose menu
 * @returns {void} - Nothing
 */
function DialogActivePoseMenuBuild() {
	DialogActivePoses = [];
	
	PoseFemale3DCG
		.filter(P => P.AllowMenu)
		.map(P => P.Category)
		.filter((C, I, Categories) => C && Categories.indexOf(C) === I)
		.forEach(Category => { 
			DialogActivePoses.push(PoseFemale3DCG.filter(P =>  P.AllowMenu && P.Category == Category));
		});
}

/**
 * Gets the correct label for the current operation (struggling, removing, swaping, adding, etc.)
 * @param {Character} C - The character who acts
 * @param {Item} PrevItem - The first item that's part of the action
 * @param {Item} NextItem - The second item that's part of the action
 * @returns {string} - The appropriate dialog option
 */
function DialogProgressGetOperation(C, PrevItem, NextItem) {
	if ((PrevItem != null) && (NextItem != null)) return DialogFindPlayer("Swapping");
	if ((C.ID == 0) && (PrevItem != null) && (SkillGetRatio("Evasion") != 1)) return DialogFindPlayer("Using" + (SkillGetRatio("Evasion") * 100).toString());
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) return DialogFindPlayer("Struggling");
	if ((PrevItem != null) && !Player.CanInteract() && !InventoryItemHasEffect(PrevItem, "Block", true)) return DialogFindPlayer("Struggling");
	if (InventoryItemHasEffect(PrevItem, "Lock", true)) return DialogFindPlayer("Unlocking");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Mounted", true)) return DialogFindPlayer("Dismounting");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Enclose", true)) return DialogFindPlayer("Escaping");
	if (PrevItem != null) return DialogFindPlayer("Removing");
	if ((PrevItem == null) && (NextItem != null) && (SkillGetRatio("Bondage") != 1)) return DialogFindPlayer("Using" + (SkillGetRatio("Bondage") * 100).toString());
	if (InventoryItemHasEffect(NextItem, "Lock", true)) return DialogFindPlayer("Locking");
	if ((PrevItem == null) && (NextItem != null)) return DialogFindPlayer("Adding");
	return "...";
}

/**
 * Gets the correct label for the current operation (struggling, removing, swaping, adding, etc.)
 * @param {Character} C - The character who acts
 * @param {Item} PrevItem - The first item that's part of the action
 * @param {Item} NextItem - The second item that's part of the action
 * @returns {string} - The appropriate dialog option
 */
function DialogLockPickProgressGetOperation(C, Item) {
	var lock = InventoryGetLock(Item)
	if ((Item != null && lock != null)) {
		if (lock.Name == "CombinationPadlock" || lock.Name == "PasswordPadlock") return DialogFindPlayer("Decoding");
		if (Item.Asset.Name.indexOf("Futuristic") >= 0 || Item.Asset.Name.indexOf("Interactive") >= 0) return DialogFindPlayer("Hacking");
		return DialogFindPlayer("Picking");
	}
	return "...";
}

/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed. 
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function DialogStruggle(Reverse) {

	// Progress calculation
	var P = 42 / (DialogProgressSkill * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
	P = P * (100 / (DialogProgress + 50));  // Faster when the dialog starts, longer when it ends	
	if ((DialogProgressChallenge > 6) && (DialogProgress > 50) && (DialogProgressAuto < 0)) P = P * (1 - ((DialogProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	P = P * (Reverse ? -1 : 1); // Reverses the progress if the user pushed the same key twice

	// Sets the new progress and writes the "Impossible" message if we need to
	DialogProgress = DialogProgress + P;
	if (DialogProgress < 0) DialogProgress = 0;
	if ((DialogProgress >= 100) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgress = 99;
	if (!Reverse) DialogProgressStruggleCount++;
	if ((DialogProgressStruggleCount >= 50) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgressOperation = DialogFindPlayer("Impossible");

	// At 15 hit: low blush, 50: Medium and 125: High
	if (DialogAllowBlush && !Reverse) {
		if (DialogProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
		if (DialogProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
		if (DialogProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
	}

	// At 15 hit: Start drooling
	if (DialogAllowFluids && !Reverse) {
		if (DialogProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");
	}

	// Over 50 progress, the character frowns
	if (DialogAllowEyebrows && !Reverse) CharacterSetFacialExpression(Player, "Eyebrows", (DialogProgress >= 50) ? "Angry" : null);

}

/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {void} - Nothing
 */
function DialogProgressStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
	var S = 0;
	if ((PrevItem != null) && (C.ID == 0)) {
		S = S + SkillGetWithRatio("Evasion"); // Add the player evasion level (modified by the effectiveness ratio)
		if (PrevItem.Difficulty != null) S = S - PrevItem.Difficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
		if ((PrevItem.Property != null) && (PrevItem.Property.Difficulty != null)) S = S - PrevItem.Property.Difficulty; // Subtract the additional item difficulty for expanded items only
	}
	if ((C.ID != 0) || ((C.ID == 0) && (PrevItem == null))) S = S + SkillGetLevel(Player, "Bondage"); // Adds the bondage skill if no previous item or playing with another player
	if (Player.IsEnclose() || Player.IsMounted()) S = S - 2; // A little harder if there's an enclosing or mounting item
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) S = S - 4; // Harder to struggle from a locked item

	// When struggling to remove or swap an item while being blocked from interacting
	if ((C.ID == 0) && !C.CanInteract() && (PrevItem != null)) {
		if (!InventoryItemHasEffect(PrevItem, "Block", true)) S = S - 4; // Non-blocking items become harder to struggle out when already blocked
		if ((PrevItem.Asset.Group.Name != "ItemArms") && InventoryItemHasEffect(InventoryGet(C, "ItemArms"), "Block", true)) S = S - 4; // Harder If we don't target the arms while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemHands") && InventoryItemHasEffect(InventoryGet(C, "ItemHands"), "Block", true)) S = S - 4; // Harder If we don't target the hands while hands are restrained
		if ((PrevItem.Asset.Group.Name != "ItemMouth") && (PrevItem.Asset.Group.Name != "ItemMouth2") && (PrevItem.Asset.Group.Name != "ItemMouth3") && (PrevItem.Asset.Group.Name != "ItemHead") && (PrevItem.Asset.Group.Name != "ItemHood") && !C.CanTalk()) S = S - 2; // A little harder if we don't target the head while gagged
		if ((ChatRoomStruggleAssistTimer >= CurrentTime) && (ChatRoomStruggleAssistBonus >= 1) && (ChatRoomStruggleAssistBonus <= 6)) S = S + ChatRoomStruggleAssistBonus; // If assisted by another player, the player can get a bonus to struggle out
	}

	// Gets the standard time to do the operation
	var Timer = 0;
	if ((PrevItem != null) && (PrevItem.Asset != null) && (PrevItem.Asset.RemoveTime != null)) Timer = Timer + PrevItem.Asset.RemoveTime; // Adds the time to remove the previous item
	if ((NextItem != null) && (NextItem.Asset != null) && (NextItem.Asset.WearTime != null)) Timer = Timer + NextItem.Asset.WearTime; // Adds the time to add the new item
	if (Player.IsBlind() || (Player.Effect.indexOf("Suspension") >= 0)) Timer = Timer * 2; // Double the time if suspended from the ceiling or blind
	if (Timer < 1) Timer = 1; // Nothing shorter than 1 second

	// If there's a locking item, we add the time of that lock
	if ((PrevItem != null) && (NextItem == null) && InventoryItemHasEffect(PrevItem, "Lock", true) && DialogCanUnlock(C, PrevItem)) {
		var Lock = InventoryGetLock(PrevItem);
		if ((Lock != null) && (Lock.Asset != null) && (Lock.Asset.RemoveTime != null)) Timer = Timer + Lock.Asset.RemoveTime;
	}

	// Prepares the progress bar and timer
	DialogProgress = 0;
	DialogProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	DialogProgressPrevItem = PrevItem;
	DialogProgressNextItem = NextItem;
	DialogProgressOperation = DialogProgressGetOperation(C, PrevItem, NextItem);
	DialogProgressSkill = Timer;
	DialogProgressChallenge = S * -1;
	DialogProgressLastKeyPress = 0;
	DialogProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) DialogProgressAuto = 0;
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) DialogProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((DialogProgressChallenge <= 6) || (DialogProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		DialogProgressAuto = 1;
		DialogProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = (NextItem && NextItem.Asset) ? NextItem.Asset.Audio : PrevItem.Asset.Audio;
		if (AudioFile != null) AudioDialogStart("Audio/" + AudioGetFileName(AudioFile) + ".mp3");
	}

}


/**
 * Starts the dialog progress bar for picking a lock
 * First the challenge level is calculated based on the base lock difficulty, the skill of the rigger and the escapee
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to unlock
 * @returns {void} - Nothing
 */
function DialogLockPickProgressStart(C, Item) {

	DialogLockPickArousalText = ""
	DialogLockPickArousalTick = 0
	if (Item) {
		DialogLockPickItem = Item
	}

	var lock = InventoryGetLock(Item)
	var LockRating = 1
	var LockPickingImpossible = false
	if (Item != null && lock) {
		// Gets the lock rating
		var BondageLevel = (Item.Difficulty - Item.Asset.Difficulty)
		
		// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to pick)
		var S = 0;
		S = S + SkillGetWithRatio("LockPicking"); // Add the player evasion level (modified by the effectiveness ratio)
		if (lock.Asset.PickDifficulty && lock.Asset.PickDifficulty > 0) {
			S = S - lock.Asset.PickDifficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
			LockRating = lock.Asset.PickDifficulty // Some features of the minigame are independent of the relative skill level
		}
		//if (Item.Asset && Item.Asset.Difficulty) {
		//	S -= BondageLevel/2 // Adds the bondage skill of the item but not the base difficulty!
		//}
		
		if (Player.IsEnclose() || Player.IsMounted()) S = S - 2; // A little harder if there's an enclosing or mounting item

		// When struggling to pick a lock while being blocked from interacting (for the future if we allow picking locks while bound -Ada)
		if (!Player.CanInteract() && (Item != null)) {
			
			if (InventoryItemHasEffect(Item, "NotSelfPickable", true))
			{
				S = S - 50; 
				LockPickingImpossible = true;
			} // Impossible if the item is such that it can't be picked alone (e.g yokes or elbow cuffs)
			else {
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemArms"), "Block", true)) {
					if (Item.Asset.Group.Name != "ItemArms" && Item.Asset.Group.Name != "ItemHands")
						S = S - 50; // MUST target arms item or hands item if your arrms are bound
					else
						S = S - 2; // Harder If arms are restrained
				}
				
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemHands"), "Block", true)) {
					if (!LogQuery("KeyDeposit", "Cell") && DialogHasKey(Player, Item))// If you have keys, its just a matter of getting the keys into the lock~
						S = S - 4;
					else // Otherwise it's not possible to pick a lock. Too much dexterity required
						S = S - 50;
					// With key, the difficulty is as follows:
					// Mittened and max Lockpinking, min bondage: Metal padlock is easy, intricate is also easy, anything above will be slightly more challenging than unmittened
					// Mittened, arms bound, and max Lockpinking, min bondage: Metal padlock is easy, intricate is somewhat hard, high security is very hard, combo impossible
				}
				
				if (S < -6) {
					LockPickingImpossible = true // The above stuff can make picking the lock impossible. Everything else will make it incrementally harder
				}
				
				if (!C.CanTalk()) S = S - 1; // A little harder while gagged, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemLegs"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemFeet"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryGroupIsBlocked(Player, "ItemFeet")) S = S - 1; // A little harder while wearing something like a legbinder as well
				if (Player.IsBlind()) S = S - 1; // harder while blind
				if (Player.GetDeafLevel() > 0) S = S - Math.Ceiling(Player.GetDeafLevel()/2); // harder while deaf
				
				// No bonus from struggle assist. Lockpicking is a solo activity!
			}
		}
		
		// Gets the number of pins on the lock
		var NumPins = 4
		if (LockRating >= 6) NumPins += 2 // 6 pins for the intricate lock
		if (LockRating >= 8) NumPins += 1 // 7 pins for the exclusive lock
		if (LockRating >= 10) NumPins += 1 // 8 pins for the high security lock
		if (LockRating >= 11) NumPins += 2 // Cap at 10 pins
		

		
			
		// Prepares the progress bar and timer
		DialogLockPickOrder = [];
		DialogLockPickSet = [];
		DialogLockPickSetFalse = [];
		DialogLockPickOffset = [];
		DialogLockPickOffsetTarget = [];
		DialogLockPickImpossiblePins = [];
		DialogLockPickProgressItem = Item;
		DialogLockPickProgressOperation = DialogLockPickProgressGetOperation(C, Item);
		DialogLockPickProgressSkill = Math.floor(NumPins*NumPins/2) + Math.floor(Math.max(0, -S)*Math.max(0, -S)); // Scales squarely, so that more difficult locks provide bigger reward!
		DialogLockPickProgressSkillLose = NumPins*NumPins/2 // Even if you lose you get some reward. You get this no matter what if you run out of tries.
		DialogLockPickProgressChallenge = S * -1;
		DialogLockPickProgressCurrentTries = 0;
		DialogLockPickSuccessTime = 0
		DialogLockPickFailTime = 0
		DialogMenuButtonBuild(C);
		
		
		
		
		for (let P = 0; P < NumPins; P++) {
			DialogLockPickOrder.push(P)
			DialogLockPickSet.push(false)
			DialogLockPickSetFalse.push(false)
			DialogLockPickOffset.push(0)
			DialogLockPickOffsetTarget.push(0)
		}
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (var i = DialogLockPickOrder.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = DialogLockPickOrder[i];
			DialogLockPickOrder[i] = DialogLockPickOrder[j];
			DialogLockPickOrder[j] = temp;
		}
		
		// Initialize persistent pins
		if ((Item.Property == null)) Item.Property = {};
		if (Item.Property != null)
			if ((Item.Property.LockPickSeed == null) || (typeof Item.Property.LockPickSeed != "string")) {Item.Property.LockPickSeed = CommonConvertArrayToString(DialogLockPickOrder); DialogLockPickTotalTries = 0}
			else {
				var conv = CommonConvertStringToArray(Item.Property.LockPickSeed)
				for (let PP = 0; PP < conv.length; PP++) {
						if (typeof conv[PP] != "number") {
							Item.Property.LockPickSeed = CommonConvertArrayToString(DialogLockPickOrder)
							conv = DialogLockPickOrder
							break;
						}
					}
				DialogLockPickOrder = conv
			}
		
		var PickingImpossible = false
		if (S < -6 && LockPickingImpossible) {
			PickingImpossible = true // if picking is impossible, then some pins will never set
			DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-1])
			if (NumPins >= 6) DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-2])
			if (NumPins >= 8) DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-3])
		}

		// At 4 pins we have a base of 16 tries, with 10 maximum permutions possible
		// At 10 pins we have a base of 40-30 tries, with 55 maximum permutions possible
		var NumTries = Math.max(Math.floor(NumPins * (1.5 - 0.3*BondageLevel/10)),
				Math.ceil(NumPins * (3.25 - BondageLevel/10) - Math.max(0, (DialogLockPickProgressChallenge + BondageLevel/2)*1.5)))
			    // negative skill of 1 subtracts 2 from the normal lock and 4 from 10 pin locks,
				// negative skill of 6 subtracts 12 from all locks
	

		DialogLockPickProgressMaxTries = NumTries - NumPins;
	}
}

/**
 * Handles the KeyDown event. The player can use the space bar to speed up the dialog progress, just like clicking.
 * Increases or decreases the struggle mini-game, if a/A or s/S were pressed.
 * @returns {void} - Nothing
 */
function DialogKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (DialogProgress >= 0) && (DialogColor == null)) {
		DialogStruggle((DialogProgressLastKeyPress == KeyPress));
		DialogProgressLastKeyPress = KeyPress;
	}
}

/**
 * Handles the Click events in the Dialog Screen
 * @returns {void} - Nothing
 */
function DialogMenuButtonClick() {

	// Finds the current icon
	for (let I = 0; I < DialogMenuButton.length; I++)
		if ((MouseX >= 1885 - I * 110) && (MouseX <= 1975 - I * 110)) {

			// Gets the current character and item
			const C = CharacterGetCurrent();
			const Item = InventoryGet(C, C.FocusGroup.Name);

			// Exit Icon - Go back to the character dialog
			if (DialogMenuButton[I] == "Exit") {
				if (DialogItemPermissionMode) ChatRoomCharacterUpdate(Player);
				if ((DialogProgressStruggleCount >= 50) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) ChatRoomStimulationMessage("StruggleFail")
				DialogLeaveItemMenu();
				return;
			}

			// Next Icon - Shows the next 12 items
			else if (DialogMenuButton[I] == "Next") {
				DialogInventoryOffset = DialogInventoryOffset + 12;
				if (DialogInventoryOffset >= DialogInventory.length) DialogInventoryOffset = 0;
				return;
			}

			// Use Icon - Pops the item extension for the focused item
			else if ((DialogMenuButton[I] == "Use") && (Item != null)) {
				DialogExtendItem(Item);
				return;
			}

			// Remote Icon - Pops the item extension
			else if ((DialogMenuButton[I] == "Remote") && DialogCanUseRemote(C, Item)) {
				DialogExtendItem(Item);
				return;
			}

			// Cycle through the layers of restraints for the mouth
			else if (DialogMenuButton[I] == "ChangeLayersMouth") {
				var NewLayerName;
				if (C.FocusGroup.Name == "ItemMouth") NewLayerName = "ItemMouth2";
				if (C.FocusGroup.Name == "ItemMouth2") NewLayerName = "ItemMouth3";
				if (C.FocusGroup.Name == "ItemMouth3") NewLayerName = "ItemMouth";
				for (let A = 0; A < AssetGroup.length; A++)
					if (AssetGroup[A].Name == NewLayerName) {
						C.FocusGroup = AssetGroup[A];
						DialogInventoryBuild(C);
					}
			}


			// Lock Icon - Rebuilds the inventory list with locking items
			else if ((DialogMenuButton[I] == "Lock") && (Item != null)) {
				if (DialogItemToLock == null) {
					if ((Item != null) && (Item.Asset.AllowLock != null)) {
						DialogInventoryOffset = 0;
						DialogInventory = [];
						DialogItemToLock = Item;
						for (let A = 0; A < Player.Inventory.length; A++)
							if ((Player.Inventory[A].Asset != null) && Player.Inventory[A].Asset.IsLock)
								DialogInventoryAdd(C, Player.Inventory[A], false, DialogSortOrderUsable);
						DialogInventorySort();
						DialogMenuButtonBuild(C);
					}
				} else {
					DialogItemToLock = null;
					DialogInventoryBuild(C);
				}
				return;
			}

			// Unlock Icon - If the item is padlocked, we immediately unlock.  If not, we start the struggle progress.
			else if ((DialogMenuButton[I] == "Unlock") && (Item != null)) {
				if (!InventoryItemHasEffect(Item, "Lock", false) && InventoryItemHasEffect(Item, "Lock", true) && ((C.ID != 0) || C.CanInteract())) {
					InventoryUnlock(C, C.FocusGroup.Name);
					if (CurrentScreen == "ChatRoom") ChatRoomPublishAction(C, Item, null, true, "ActionUnlock");
					else DialogInventoryBuild(C);
					DialogLockMenu = false
				} else DialogProgressStart(C, Item, null);
				DialogLockPickOrder = null
				DialogLockMenu = false
				return;
			}

			// Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (((DialogMenuButton[I] == "Remove") || (DialogMenuButton[I] == "Struggle") || (DialogMenuButton[I] == "Dismount") || (DialogMenuButton[I] == "Escape")) && (Item != null)) {
				DialogProgressStart(C, Item, null);
				return;
			}
			
			// Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (((DialogMenuButton[I] == "PickLock")) && (Item != null)) {
				DialogLockPickProgressStart(C, Item);
				return;
			}

			// When the player inspects a lock
			else if ((DialogMenuButton[I] == "InspectLock") && (Item != null)) {
				var Lock = InventoryGetLock(Item);
				if (Lock != null) DialogExtendItem(Lock, Item);
				return;
			}

			// Color picker Icon - Starts the color picking, keeps the original color and shows it at the bottom
			else if (DialogMenuButton[I] == "ColorPick") {
				if (!Item) {
					ElementCreateInput("InputColor", "text", (DialogColorSelect != null) ? DialogColorSelect.toString() : "");
				} else {
					const originalColor = Item.Color;
					ItemColorLoad(C, Item, 1300, 25, 675, 950);
					ItemColorOnExit((save) => {
						DialogColor = null;
						if (save && !CommonColorsEqual(originalColor, Item.Color)) {
							if (C.ID == 0) ServerPlayerAppearanceSync();
							ChatRoomPublishAction(C, Object.assign({}, Item, { Color: originalColor }), Item, false);
						}
					});
				}
				DialogColor = "";
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user selects a color, applies it to the item
			else if (!Item && (DialogMenuButton[I] == "ColorSelect") && CommonIsColor(ElementValue("InputColor"))) {
				DialogColor = null;
				DialogColorSelect = ElementValue("InputColor");
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user cancels out of color picking, we recall the original color
			else if (!Item && DialogMenuButton[I] == "ColorCancel") {
				DialogColor = null;
				DialogColorSelect = null;
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}


			// When the user cancels out of lock menu, we recall the original color
			else if (Item && DialogMenuButton[I] == "LockCancel") {
				DialogLockMenu = false
				DialogLockPickOrder = null
				DialogMenuButtonBuild(C);
				return;
			}
			// When the user selects the lock menu, we enter
			else if (Item && DialogMenuButton[I] == "LockMenu") {
				DialogLockMenu = true
				DialogMenuButtonBuild(C);
				return;
			}


			// When the user wants to select a sexual activity to perform
			else if (DialogMenuButton[I] == "Activity") {
				DialogActivityMode = true;
				DialogMenuButton = null;
				DialogInventoryOffset = 0;
				DialogTextDefault = "";
				DialogTextDefaultTimer = 0;
				return;
			}

			// When we enter item permission mode, we rebuild the inventory to set permissions
			else if (DialogMenuButton[I] == "DialogPermissionMode") {
				DialogItemPermissionMode = true;
				DialogItemToLock = null;
				DialogInventoryBuild(C);
				return;
			}

			// When we leave item permission mode, we upload the changes for everyone in the room
			else if (DialogMenuButton[I] == "DialogNormalMode") {
				if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
				DialogItemPermissionMode = false;
				DialogInventoryBuild(C);
				return;
			}
		}

}

/**
 * Publishes the item action to the local chat room or the dialog screen
 * @param {Character} C - The character who is the actor in this action
 * @param {Item} ClickItem - The item that is used
 * @returns {void} - Nothing
 */
function DialogPublishAction(C, ClickItem) {

	// The shock triggers can trigger items that can shock the wearer
	if (C.FocusGroup != null) {
		var TargetItem = (InventoryGet(C, C.FocusGroup.Name));
		if (InventoryItemHasEffect(ClickItem, "TriggerShock") && InventoryItemHasEffect(TargetItem, "ReceiveShock")) {
			if (CurrentScreen == "ChatRoom") {
				var intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				InventoryExpressionTrigger(C, ClickItem);
				ChatRoomPublishCustomAction(TargetItem.Asset.Name + "Trigger" + intensity, true, [{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber }]);
			}
			else {
				var intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				var D = (DialogFindPlayer(TargetItem.Asset.Name + "Trigger" + intensity)).replace("DestinationCharacterName", C.Name);
				if (D != "") {
					InventoryExpressionTrigger(C, ClickItem);
					C.CurrentDialog = "(" + D + ")";
					DialogLeaveItemMenu();
				}
			}
			return;
		}
	}

	// Publishes the item result
	if ((CurrentScreen == "ChatRoom") && !InventoryItemHasEffect(ClickItem)) {
		InventoryExpressionTrigger(C, ClickItem);
		ChatRoomPublishAction(C, null, ClickItem, true);
	}
	else {
		var D = DialogFind(C, ClickItem.Asset.Group.Name + ClickItem.Asset.Name, null, false);
		if (D != "") {
			InventoryExpressionTrigger(C, ClickItem);
			C.CurrentDialog = D;
			DialogLeaveItemMenu();
		}
	}

}

/**
 * Handles clicks on an item
 * @param {Item} ClickItem - The item that is clicked
 * @returns {void} - Nothing
 */
function DialogItemClick(ClickItem) {

	// Gets the current character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var CurrentItem = InventoryGet(C, C.FocusGroup.Name);

	// In permission mode, the player can allow or block items for herself
	if ((C.ID == 0) && DialogItemPermissionMode) {
		if (ClickItem.Worn || (CurrentItem && (CurrentItem.Asset.Name == ClickItem.Asset.Name))) return;
		InventoryTogglePermission(ClickItem, null);
		return;
	}

	// If the item is blocked or limited for that character, we do not use it
	if (InventoryBlockedOrLimited(C, ClickItem)) return;

	// If we must apply a lock to an item (can trigger a daily job)
	if (DialogItemToLock != null) {
		if ((CurrentItem != null) &&
			(CurrentItem.Asset.AllowLock || CurrentItem.Asset.Extended && CurrentItem.Property && CurrentItem.Property.AllowLock !== false && CurrentItem.Asset.AllowLockType.indexOf(CurrentItem.Property.Type)>=0)) {
			InventoryLock(C, CurrentItem, ClickItem, Player.MemberNumber);
			IntroductionJobProgress("DomLock", ClickItem.Asset.Name, true);
			DialogItemToLock = null;
			DialogInventoryBuild(C);
			ChatRoomPublishAction(C, CurrentItem, ClickItem, true);
		}
		return;
	}

	// Cannot change item if the previous one is locked or blocked by another group
	if ((CurrentItem == null) || !InventoryItemHasEffect(CurrentItem, "Lock", true)) {
<<<<<<< HEAD
		if (!InventoryGroupIsBlocked(C))
=======
		if (!InventoryGroupIsBlocked(C, null, true) && (!InventoryGroupIsBlocked(C) || !ClickItem.Worn))
>>>>>>> upstream/master
			if (InventoryAllow(C, ClickItem.Asset.Prerequisite) && InventoryChatRoomAllow(ClickItem.Asset.Category))
				if ((CurrentItem == null) || (CurrentItem.Asset.Name != ClickItem.Asset.Name)) {
					if (ClickItem.Asset.Wear) {

						// Check if selfbondage is allowed for the item if used on self
						if ((ClickItem.Asset.SelfBondage <= 0) || (SkillGetLevel(Player, "SelfBondage") >= ClickItem.Asset.SelfBondage) || (C.ID != 0) || DialogAlwaysAllowRestraint()) DialogProgressStart(C, CurrentItem, ClickItem);
						else if (ClickItem.Asset.SelfBondage <= 10) DialogSetText("RequireSelfBondage" + ClickItem.Asset.SelfBondage);
						else DialogSetText("CannotUseOnSelf");

					} else {

						// The vibrating egg remote can open the vibrating egg's extended dialog
						var Item = InventoryGet(C, C.FocusGroup.Name);
						if ((ClickItem.Asset.Name === "VibratorRemote" || ClickItem.Asset.Name === "LoversVibratorRemote") && DialogCanUseRemote(C, CurrentItem)) {
							DialogExtendItem(InventoryGet(C, C.FocusGroup.Name));
						}

						// Runs the activity arousal process if activated, & publishes the item action text to the chatroom
						DialogPublishAction(C, ClickItem);
						ActivityArousalItem(Player, C, ClickItem.Asset);

					}
				}
				else
					if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
						DialogExtendItem(CurrentItem);
		return;
	}

	// If the item can unlock another item or simply show dialog text (not wearable)
	if (InventoryAllow(C, ClickItem.Asset.Prerequisite))
		if (InventoryItemHasEffect(ClickItem, "Unlock-" + CurrentItem.Asset.Name))
			DialogProgressStart(C, CurrentItem, null);
		else
			if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
				DialogExtendItem(CurrentItem);
			else
				if (!ClickItem.Asset.Wear)
					DialogPublishAction(C, ClickItem);

}

/**
 * Handles the click in the dialog screen
 * @returns {void} - Nothing
 */
function DialogClick() {

	// If the user clicked the Up button, move the character up to the top of the screen
	if ((CurrentCharacter.HeightModifier < -90) && (CurrentCharacter.FocusGroup != null) && MouseIn (510,50,90,90)) {
		CharacterAppearanceForceUpCharacter = CurrentCharacter.MemberNumber;
		CurrentCharacter.HeightModifier = 0;
		return;
	}


	if (DialogColor != null && CurrentCharacter.FocusGroup && InventoryGet(CurrentCharacter, CurrentCharacter.FocusGroup.Name) && MouseIn(1300, 25, 675, 950)) {
		return ItemColorClick(CurrentCharacter, CurrentCharacter.FocusGroup.Name, 1200, 25, 775, 950, true);
	}

	// If the user clicked on the interaction character or herself, we check to build the item menu
<<<<<<< HEAD
	if ((CurrentCharacter.AllowItem || (MouseX < 500)) && (MouseX >= 0) && (MouseX <= 1000) && (MouseY >= 0) && (MouseY < 1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "") && DialogAllowItemScreenException()) {
=======
	if ((CurrentCharacter.AllowItem || (MouseX < 500)) && MouseIn(0,0,1000,1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "") && DialogAllowItemScreenException()) {
>>>>>>> upstream/master
		DialogLeaveItemMenu();
		DialogLeaveFocusItem();
		var C = (MouseX < 500) ? Player : CurrentCharacter;
		let X = MouseX < 500 ? 0 : 500;
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if (DialogClickedInZone(C, AssetGroup[A].Zone[Z], 1, X, 0, C.HeightRatio)) {
						C.FocusGroup = AssetGroup[A];
						DialogItemToLock = null;
						DialogFocusItem = null;
						DialogInventoryBuild(C);
						DialogText = DialogTextDefault;
						break;
					}
	}

	// If the user clicked anywhere outside the current character item zones, ensure the position is corrected
	if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber && ((MouseX < 500) || (MouseX > 1000) || (CurrentCharacter.FocusGroup == null))) {
		CharacterAppearanceForceUpCharacter = 0;
		CharacterAppearanceSetHeightModifiers(CurrentCharacter);
	}

	// In activity mode, we check if the user clicked on an activity box
	if (DialogActivityMode && (DialogProgress < 0 && !DialogLockPickOrder) && (DialogColor == null) && ((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)))
		if ((MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000)) {

			// For each activities in the list
			var X = 1000;
			var Y = 125;
			for (let A = DialogInventoryOffset; (A < DialogActivity.length) && (A < DialogInventoryOffset + 12); A++) {

				// If this specific activity is clicked, we run it
				if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
					IntroductionJobProgress("SubActivity", DialogActivity[A].MaxProgress.toString(), true);
					ActivityRun((Player.FocusGroup != null) ? Player : CurrentCharacter, DialogActivity[A]);
					return;
				}

				// Change the X and Y position to get the next square
				X = X + 250;
				if (X > 1800) {
					X = 1000;
					Y = Y + 300;
				}

			}

			// Exits and do not validate any more clicks
			return;

		}

	// In item menu mode VS text dialog mode
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		// If we must are in the extended menu of the item
		if (DialogFocusItem != null)
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
		else {

			// If the user wants to speed up the add / swap / remove progress
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 600) && (MouseY < 1000) && (DialogProgress >= 0) && CommonIsMobile) DialogStruggle(false);
			
			// If the user wants to pick a lock
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 200) && (MouseY < 1000) && (DialogLockPickOrder)) {DialogLockPickClick(CurrentCharacter); return;}

			// If the user wants to click on one of icons in the item menu
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 15) && (MouseY <= 105)) DialogMenuButtonClick();

			// If the user clicks on one of the items
			if ((MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000) && ((DialogItemPermissionMode && (Player.FocusGroup != null)) || (Player.CanInteract() && !InventoryGroupIsBlocked((Player.FocusGroup != null) ? Player : CurrentCharacter, null, true))) && (DialogProgress < 0 && !DialogLockPickOrder) && (DialogColor == null)) {
				// For each items in the player inventory
				var X = 1000;
				var Y = 125;
				for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {

					// If the item is clicked
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275))
						if (DialogInventory[I].Asset.Enable || (DialogInventory[I].Asset.Extended && DialogInventory[I].Asset.OwnerOnly && CurrentCharacter.IsOwnedByPlayer())) {
							DialogItemClick(DialogInventory[I]);
							break;
						}

					// Change the X and Y position to get the next square
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}

				}
			}
		}

	} else {

		// If we need to leave the dialog (only allowed when there's an entry point to the dialog, not in the middle of a conversation)
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT") && (MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110))
			DialogLeave();

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 990) && (CurrentCharacter != null)) {
			var pos = 0;
			for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {

						// If the player is gagged, the answer will always be the same
						if (!Player.CanTalk()) CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerGagged");
						else CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;

						// A dialog option can change the conversation stage, show text or launch a custom function						
						if ((Player.CanTalk() && CurrentCharacter.CanTalk()) || SpeechFullEmote(CurrentCharacter.Dialog[D].Option)) {
							CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Function);
						} else
							if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "DialogLeave()"))
								DialogLeave();
						break;

					}
					pos++;
				}
		}

	}

	// If the user clicked in the facial expression menu
	if ((CurrentCharacter != null) && (CurrentCharacter.ID == 0) && (MouseX >= 0) && (MouseX <= 500)) {
<<<<<<< HEAD
		if (MouseIn(390, 50, 90, 90) && DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1) DialogFindNextSubMenu();
=======
		if (MouseIn(420, 50, 90, 90) && DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1) DialogFindNextSubMenu();
>>>>>>> upstream/master
		if (!DialogSelfMenuSelected)
			DialogClickExpressionMenu();
		else
			DialogSelfMenuSelected.Click();
	}

}

/**
 * Returns whether the clicked co-ordinates are inside the asset zone
 * @param {Character} C - The character the click is on
 * @param {Array} Zone - The 4 part array of the rectangular asset zone on the character's body: [X, Y, Width, Height]
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} X - The X co-ordinate of the click
 * @param {number} Y - The Y co-ordinate of the click
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {boolean} - If TRUE the click is inside the zone
 */
function DialogClickedInZone(C, Zone, Zoom, X, Y, HeightRatio) {
	let CZ = DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio);
	return MouseIn(CZ[0], CZ[1], CZ[2], CZ[3]);
}

/**
 * Return the co-ordinates and dimensions of the asset group zone as it appears on screen
 * @param {Character} C - The character the zone is calculated for
 * @param {Array} Zone - The 4 part array of the rectangular asset zone: [X, Y, Width, Height]
 * @param {number} X - The starting X co-ordinate of the character's position
 * @param {number} Y - The starting Y co-ordinate of the character's position
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {Array} - The 4 part array of the displayed rectangular asset zone: [X, Y, Width, Height]
 */
function DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio) {
	X += CharacterAppearanceXOffset(C, HeightRatio) * Zoom;
	Y += CharacterAppearanceYOffset(C, HeightRatio) * Zoom;
	Zoom *= HeightRatio;

	let Left = X + Zone[0] * Zoom;
	let Top = CharacterAppearsInverted(C) ? 1000 - (Y + (Zone[1] + Zone[3]) * Zoom) : Y + Zone[1] * Zoom;
	let Width = Zone[2] * Zoom;
	let Height = Zone[3] * Zoom;
	return [Left, Top, Width, Height];
}

/**
 * Finds and sets the next available character sub menu.
 * @returns {void} - Nothing
 */
function DialogFindNextSubMenu() { 
	var CurrentIndex = DialogSelfMenuOptions.indexOf(DialogSelfMenuSelected);
	if (CurrentIndex == -1) CurrentIndex = 0;
	
	var NextIndex = CurrentIndex + 1 == DialogSelfMenuOptions.length ? 0 : CurrentIndex + 1;
	
	for (let SM = NextIndex; SM < DialogSelfMenuOptions.length; SM++) { 
		if (DialogSelfMenuOptions[SM].IsAvailable()) { 
			DialogSelfMenuSelected = DialogSelfMenuOptions[SM];
			return;
		}
		if (SM + 1 == DialogSelfMenuOptions.length) SM = -1;
	}
}

/**
 * Displays the given text for 5 seconds
 * @param {string} NewText - The text to be displayed
 * @returns {void} - Nothing
 */
function DialogSetText(NewText) {
	DialogTextDefaultTimer = CommonTime() + 5000;
	DialogText = DialogFindPlayer(NewText);
}

/**
 * Shows the extended item menue for a given item, if possible. 
 * Therefore a dynamic function name is created and then called.
 * @param {Item} Item - The item the extended menu should be shown for
 * @param {Item} SourceItem - The source of the extended menu
 * @returns {void} - Nothing
 */
function DialogExtendItem(Item, SourceItem) {
	DialogProgress = -1;
	DialogLockPickOrder = null
	DialogLockMenu = false
	DialogColor = null;
	DialogFocusItem = Item;
	DialogFocusSourceItem = SourceItem;
	CommonDynamicFunction("Inventory" + Item.Asset.Group.Name + Item.Asset.Name + "Load()");
}

/**
 * Validates that the player is allowed to change the item color and swaps it on the fly
 * @param {Character} C - The player who wants to change the color
 * @param {string} Color - The new color in the format "#rrggbb"
 * @returns {void} - Nothing
 */
function DialogChangeItemColor(C, Color) {

	// Validates that the player isn't blind and can interact with the item
	if (!Player.CanInteract() || Player.IsBlind()) return;

	// If the item is locked, make sure the player could unlock it before swapping colors
	var Item = InventoryGet(C, C.FocusGroup.Name);
	if (Item == null) return;
	if (InventoryItemHasEffect(Item, "Lock", true) && !DialogCanUnlock(C, Item)) return;

	// Make sure the item is allowed, the group isn't blocked and it's not an enclosing item
	if (!InventoryAllow(C, Item.Asset.Prerequisite) || InventoryGroupIsBlocked(C)) return;
	if (InventoryItemHasEffect(Item, "Enclose", true) && (C.ID == 0)) return;

	// Apply the color & redraw the character after 100ms.  Prevent unnecessary redraws to reduce performance impact
	Item.Color = Color;
	clearTimeout(DialogFocusItemColorizationRedrawTimer);
	DialogFocusItemColorizationRedrawTimer = setTimeout(function () { CharacterAppearanceBuildCanvas(C); }, 100);

}

/**
 * Draw the activity selection dialog
 * @param {Character} C - The character for whom the activity selection dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawActivityMenu(C) {

	// Gets the default text that will reset after 5 seconds
	var SelectedGroup = (Player.FocusGroup != null) ? Player.FocusGroup.Description : CurrentCharacter.FocusGroup.Description;
	if (DialogTextDefault == "") DialogTextDefault = DialogFindPlayer("SelectActivityGroup").replace("GroupName", SelectedGroup.toLowerCase());
	if (DialogTextDefaultTimer < CommonTime()) DialogText = DialogTextDefault;

	// Draws the top menu text & icons
	if (DialogMenuButton == null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
	if (DialogMenuButton.length < 8) DrawTextWrap(DialogText, 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White");
	for (let I = DialogMenuButton.length - 1; I >= 0; I--)
		DrawButton(1885 - I * 110, 15, 90, 90, "", "White", "Icons/" + DialogMenuButton[I] + ".png", DialogFindPlayer(DialogMenuButton[I]));

	// Prepares a 4x3 square selection with all activities in the buffer
	var X = 1000;
	var Y = 125;
	for (let A = DialogInventoryOffset; (A < DialogActivity.length) && (A < DialogInventoryOffset + 12); A++) {
		var Act = DialogActivity[A];
		var Hover = (MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile;
		DrawRect(X, Y, 225, 275, (Hover) ? "cyan" : "white");
		DrawImageResize("Assets/" + C.AssetFamily + "/Activity/" + Act.Name + ".png", X + 2, Y + 2, 221, 221);
		DrawTextFit(ActivityDictionaryText("Activity" + Act.Name), X + 112, Y + 250, 221, "black");
		X = X + 250;
		if (X > 1800) {
			X = 1000;
			Y = Y + 300;
		}
	}

}

/**
 * Draw the struggle dialog
 * @param {Character} C - The character for whom the struggle dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawStruggleProgress(C) {
	// Draw one or both items
	if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null)) {
		DrawAssetPreview(1200, 250, DialogProgressPrevItem.Asset);
		DrawAssetPreview(1575, 250, DialogProgressNextItem.Asset);
	} else DrawAssetPreview(1387, 250, (DialogProgressPrevItem != null) ? DialogProgressPrevItem.Asset : DialogProgressNextItem.Asset);

	// Add or subtract to the automatic progression, doesn't move in color picking mode
	DialogProgress = DialogProgress + DialogProgressAuto;
	if (DialogProgress < 0) DialogProgress = 0;
	
	// We cancel out if at least one of the following cases apply: a new item conflicts with this, the player can no longer interact, something else was added first, the item was already removed
	if (InventoryGroupIsBlocked(C) || (C != Player && !Player.CanInteract()) || (DialogProgressNextItem == null && !InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name)) || (DialogProgressNextItem != null && !InventoryAllow(C, DialogProgressNextItem.Asset.Prerequisite)) || (DialogProgressNextItem != null && DialogProgressPrevItem != null && ((InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name) && InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name).Asset.Name != DialogProgressPrevItem.Asset.Name) || !InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name))) || (DialogProgressNextItem != null && DialogProgressPrevItem == null && InventoryGet(C, DialogProgressNextItem.Asset.Group.Name))) {
		if (DialogProgress > 0)
			ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, true, "interrupted");
		else
			DialogLeave();
		DialogProgress = -1;
		DialogLockMenu = false
		return;
	}

	// Draw the current operation and progress
	if (DialogProgressAuto < 0) DrawText(DialogFindPlayer("Challenge") + " " + ((DialogProgressStruggleCount >= 50) ? DialogProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(DialogProgressOperation, 1500, 650, "White", "Black");
	DrawProgressBar(1200, 700, 600, 100, DialogProgress);
	if (ControllerActive == false) {
		DrawText(DialogFindPlayer((CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");
	}
	if (ControllerActive == true) {
		DrawText(DialogFindPlayer((CommonIsMobile) ? "ProgressClick" : "ProgressKeysController"), 1500, 900, "White", "Black");
	}
	// If the operation is completed
	if (DialogProgress >= 100) {

		// Stops the dialog sounds
		AudioDialogStop();

		// Removes the item & associated items if needed, then wears the new one 
		InventoryRemove(C, C.FocusGroup.Name);
		if (DialogProgressNextItem != null) InventoryWear(C, DialogProgressNextItem.Asset.Name, DialogProgressNextItem.Asset.Group.Name, (DialogColorSelect == null) ? "Default" : DialogColorSelect, SkillGetWithRatio("Bondage"), Player.MemberNumber);

		// The player can use another item right away, for another character we jump back to her reaction
		if (C.ID == 0) {
			if (DialogProgressNextItem == null) SkillProgress("Evasion", DialogProgressSkill);
			if ((DialogProgressPrevItem == null) && (DialogProgressNextItem != null)) SkillProgress("SelfBondage", (DialogProgressSkill + DialogProgressNextItem.Asset.SelfBondage) * 2);
			if ((DialogProgressNextItem == null) || !DialogProgressNextItem.Asset.Extended) {
				DialogInventoryBuild(C);
				DialogProgress = -1;
				DialogColor = null;
			}
		} else {
			if (DialogProgressNextItem != null) SkillProgress("Bondage", DialogProgressSkill);
			if (((DialogProgressNextItem == null) || !DialogProgressNextItem.Asset.Extended) && (CurrentScreen != "ChatRoom")) {
				C.CurrentDialog = DialogFind(C, ((DialogProgressNextItem == null) ? ("Remove" + DialogProgressPrevItem.Asset.Name) : DialogProgressNextItem.Asset.Name), ((DialogProgressNextItem == null) ? "Remove" : "") + C.FocusGroup.Name);
				DialogLeaveItemMenu();
			}
		}

		// Check to open the extended menu of the item.  In a chat room, we publish the result for everyone
		if ((DialogProgressNextItem != null) && DialogProgressNextItem.Asset.Extended) {
			DialogInventoryBuild(C);
			ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, false);
			DialogExtendItem(InventoryGet(C, DialogProgressNextItem.Asset.Group.Name));
		} else ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, true);

		// Reset the the character's position
		if (CharacterAppearanceForceUpCharacter == C.MemberNumber) {
			CharacterAppearanceForceUpCharacter = 0;
			CharacterAppearanceSetHeightModifiers(C);
		}

		// Rebuilds the menu
		DialogEndExpression();
		if (C.FocusGroup != null) DialogMenuButtonBuild(C);

	}
	return;
}

/**
 * Advances the lock picking dialog
 * @returns {void} - Nothing
 */
function DialogLockPickClick(C) {
	var X = 1475
	var Y = 500
	var PinSpacing = 100
	var PinWidth = 200
	var PinHeight = 200
	var skill = Math.min(10, SkillGetWithRatio("LockPicking"))
	var current_pins = DialogLockPickSet.filter(x => x==true).length
	var false_set_chance = 0.75 - 0.15 * skill/10
	var unset_false_set_chance = 0.1 + 0.1 * skill/10
	if (current_pins < DialogLockPickSet.length && LogValue("FailedLockPick", "LockPick") < CurrentTime)
		for (let P = 0; P < DialogLockPickSet.length; P++) {
			if (!DialogLockPickSet[P]) {
				var XX = X - PinWidth/2 + (0.5-DialogLockPickSet.length/2 + P) * PinSpacing
				if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight)) {
					if (DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries) {
						
						if (DialogLockPickOrder[current_pins] == P && DialogLockPickImpossiblePins.filter(x => x==P).length == 0) {
							// Successfully set the pin
							DialogLockPickSet[P] = true
							DialogLockPickArousalText = ""; // Reset arousal text
							// We also unset any false set pins
							if (current_pins+1 < DialogLockPickOrder.length && DialogLockPickSetFalse[DialogLockPickOrder[current_pins+1]] == true) {
								DialogLockPickSetFalse[DialogLockPickOrder[current_pins+1]] = false
								DialogLockPickProgressCurrentTries += 1
							}
						} else {
							// There is a chance we false set
							if (Math.random() < false_set_chance) {
								DialogLockPickSetFalse[P] = true
							} else if (DialogLockPickSetFalse[P] == false) {
							// Otherwise: fail
								DialogLockPickProgressCurrentTries += 1
								DialogLockPickTotalTries += 1
							}
						}
						if (DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries) {
							for (let PP = 0; PP < DialogLockPickSetFalse.length; PP++) {
								if (P != PP && DialogLockPickSetFalse[PP] == true && Math.random() < unset_false_set_chance) {
									DialogLockPickSetFalse[PP] = false;
									DialogLockPickProgressCurrentTries += 1
									break;
								}
							}
						}
						var order = Math.max(0, DialogLockPickOrder.indexOf(P)-current_pins)/Math.max(1, DialogLockPickSet.length-current_pins) * (0.25+0.75*skill/10) // At higher skills you can see which pins are later in the order
						DialogLockPickOffsetTarget[P] = (DialogLockPickSet[P] || DialogLockPickSetFalse[P]) ? PinHeight : PinHeight*(0.1+0.8*order)
						
						if (DialogLockPickProgressCurrentTries == DialogLockPickProgressMaxTries && DialogLockPickSet.filter(x => x==false).length > 0 ) {
							SkillProgress("LockPicking", DialogLockPickProgressSkillLose);
							if (DialogLentLockpicks)  {
								DialogLentLockpicks = false
								if (CurrentScreen == "ChatRoom")
									ChatRoomPublishCustomAction("LockPickBreak", true, [{ Tag: "DestinationCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }]);
							}
							
						}
					}
					
					
					

					break;
				}
			}
		}
		
	if (current_pins >= DialogLockPickSet.length - 1 && DialogLockPickSet.filter(x => x==false).length == 0 ) {
		DialogLockPickSuccessTime = CurrentTime + 1000;
	}
}


/**
var DialogLockPickOrder = null;
var DialogLockPickSet = null;
var DialogLockPickImpossiblePins = null;
var DialogLockPickProgressItem = null;
var DialogLockPickProgressOperation = "";
var DialogLockPickProgressSkill = 0;
var DialogLockPickProgressChallenge = 0;
var DialogLockPickProgressMaxTries = 0;
var DialogLockPickProgressCurrentTries = 0;
 * Draw the lockpicking dialog
 * @param {Character} C - The character for whom the lockpicking dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawLockpickProgress(C) {
	// Place where to draw the pins
	var X = 1475
	var Y = 500
	var PinSpacing = 100
	var PinWidth = 200
	var PinHeight = 200
	for (let P = 0; P < DialogLockPickSet.length; P++) {
		var XX = X - PinWidth/2 + (0.5-DialogLockPickSet.length/2 + P) * PinSpacing
		
		if (DialogLockPickOffset[P] < DialogLockPickOffsetTarget[P]) {
			
			if ( DialogLockPickOffsetTarget[P] == 0)
				DialogLockPickOffset[P] = 0
			else
				DialogLockPickOffset[P] += 1 + Math.abs(DialogLockPickOffsetTarget[P] - DialogLockPickOffset[P])/4
		}
		if (DialogLockPickOffset[P] >= DialogLockPickOffsetTarget[P]) {
			if (DialogLockPickOffsetTarget[P] != 0)
				DialogLockPickOffset[P] = DialogLockPickOffsetTarget[P]
			if (DialogLockPickOffsetTarget[P] != PinHeight || (!DialogLockPickSetFalse[P] && !DialogLockPickSet[P])) {
				DialogLockPickOffsetTarget[P] = 0
				DialogLockPickOffset[P] -= 1 + Math.abs(DialogLockPickOffsetTarget[P] - DialogLockPickOffset[P])/8
			}
		}
		
		DrawImageResize("Screens/MiniGame/Lockpick/Cylinder.png", XX, Y - PinHeight, PinWidth, PinWidth + PinHeight);
		DrawImageResize("Screens/MiniGame/Lockpick/Pin.png", XX, Y - DialogLockPickOffset[P], PinWidth, PinWidth);
		if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight))
			DrawImageResize("Screens/MiniGame/Lockpick/Arrow.png", XX, Y + 25, PinWidth, PinWidth);
	}


	DrawText(DialogFindPlayer("LockpickTriesRemaining") + (DialogLockPickProgressMaxTries - DialogLockPickProgressCurrentTries), X, 212, "white");
	if (LogValue("FailedLockPick", "LockPick") > CurrentTime)
		DrawText(DialogFindPlayer("LockpickFailedTimeout") + TimerToString(LogValue("FailedLockPick", "LockPick") - CurrentTime), X, 262, "red");
	else {
		if (DialogLockPickProgressCurrentTries >= DialogLockPickProgressMaxTries && DialogLockPickSuccessTime == 0) {
			if (DialogLockPickFailTime > 0) {
				if (DialogLockPickFailTime < CurrentTime) {
					DialogLockPickFailTime = 0
					
					DialogLockPickProgressStart(C, DialogLockPickItem)
					
				}
				else {
					DrawText(DialogFindPlayer("LockpickFailed"), X, 262, "red");
				}
			} else if (Math.random() < 0.25 && DialogLockPickTotalTries > 5) { // DialogLockPickTotalTries is meant to give players a bit of breathing room so they don't get tired right away
				LogAdd("FailedLockPick", "LockPick", CurrentTime + DialogLockPickFailTimeout);
				DialogLockPickFailTime = CurrentTime + DialogLockPickFailTimeout;
				DialogLockPickTotalTries = 0
			} else 
				DialogLockPickFailTime = CurrentTime + 1500
		}
		if (DialogLockPickArousalText != "") {
			DrawText(DialogLockPickArousalText, X, 170, "pink");
		}
	}


	DrawText(DialogFindPlayer("LockpickIntro"), X, 800, "white");
	DrawText(DialogFindPlayer("LockpickIntro2"), X, 850, "white");

	if (DialogLockPickSuccessTime != 0) {
		if (CurrentTime > DialogLockPickSuccessTime) {
			DialogLockPickSuccessTime = 0
			// Success!
			if (C.FocusGroup && C) {
				var item = InventoryGet(C, C.FocusGroup.Name)
				if (item) {
					InventoryUnlock(C, item)
				}
			}
			SkillProgress("LockPicking", DialogLockPickProgressSkill);
			// The player can use another item right away, for another character we jump back to her reaction
			if (C.ID == 0) {
				DialogInventoryBuild(C);
				DialogLockPickOrder = null;
				DialogLockMenu = false;
				DialogMenuButtonBuild(C);
				
			} else {
				DialogLeaveItemMenu();
			}
			if (CurrentScreen == "ChatRoom" && Player.FocusGroup) {
				var item = InventoryGet(C, Player.FocusGroup.Name)
				if (item)
					ChatRoomPublishAction(C, item, null, true, "ActionPick");
			}
		}
	} else {
		if ( Player.ArousalSettings && Player.ArousalSettings.Progress > 20 && DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries && DialogLockPickProgressCurrentTries > 0) {
			if (CurrentTime > DialogLockPickArousalTick) {
				var arousalmaxtime = 2.6 - 2.0*Player.ArousalSettings.Progress/100
				if (DialogLockPickArousalTick - CurrentTime > CurrentTime + DialogLockPickArousalTickTime*arousalmaxtime) {
					DialogLockPickArousalTick = CurrentTime + DialogLockPickArousalTickTime*arousalmaxtime // In case it gets set out way too far
				}

				if (DialogLockPickArousalTick > 0 && DialogLockPickSet.filter(x => x==true).length > 0) {
					DialogLockPickArousalText = DialogFindPlayer("LockPickArousal")
					if (DialogLockPickSet.filter(x => x==true).length < DialogLockPickSet.length) {
						for (let P = DialogLockPickOrder.length; P >= 0; P--) {
							if (DialogLockPickSet[DialogLockPickOrder[P]] == true) {
								DialogLockPickOffsetTarget[DialogLockPickOrder[P]] = 0
								DialogLockPickSet[DialogLockPickOrder[P]] = false
								break;
							}
						}
					}
				}
				
				var arousalmod = (0.3 + Math.random()*0.7) * (arousalmaxtime) // happens very often at 100 arousal
				DialogLockPickArousalTick = CurrentTime + DialogLockPickArousalTickTime * arousalmod
			}
			var alpha = "10"
			if (DialogLockPickArousalTick - CurrentTime < 1000) alpha = "70"
			else if (DialogLockPickArousalTick - CurrentTime < 2000) alpha = "50"
			else if (DialogLockPickArousalTick - CurrentTime < 3000) alpha = "30"
			else if (DialogLockPickArousalTick - CurrentTime < 5000) alpha = "20";
			DrawRect(0, 0, 2000, 1000, "#FFB0B0" + alpha);
		} else {
			DialogLockPickArousalText = ""
		}
	}
	
}

/**
 * Draw the item menu dialog
 * @param {Character} C - The character for whom the activity selection dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawItemMenu(C) {

	const FocusItem = InventoryGet(C, C.FocusGroup.Name);

	if (DialogColor != null && FocusItem) {
		return ItemColorDraw(C, C.FocusGroup.Name, 1200, 25, 775, 950, true);
	}

	// Gets the default text that will reset after 5 seconds
	if (DialogTextDefault == "") DialogTextDefault = DialogFindPlayer("SelectItemGroup").replace("GroupName", C.FocusGroup.Description.toLowerCase());
	if (DialogTextDefaultTimer < CommonTime()) DialogText = DialogTextDefault;

	// Draws the top menu text & icons
	if (DialogMenuButton == null) DialogMenuButtonBuild(CharacterGetCurrent());
	if ((DialogColor == null) && Player.CanInteract() && (DialogProgress < 0 && !DialogLockPickOrder) && !InventoryGroupIsBlocked(C) && DialogMenuButton.length < 8) DrawTextWrap((!DialogItemPermissionMode) ? DialogText : DialogFindPlayer("DialogPermissionMode"), 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White", null, 3);
	for (let I = DialogMenuButton.length - 1; I >= 0; I--) {
		let ButtonColor = (DialogMenuButton[I] == "ColorPick") && (DialogColorSelect != null) ? DialogColorSelect : "White";
		let ButtonImage = DialogMenuButton[I] == "ColorPick" && !ItemColorIsSimple(FocusItem) ? "MultiColorPick" : DialogMenuButton[I];
		let ButtonHoverText = (DialogColor == null) ? DialogFindPlayer(DialogMenuButton[I]) : null;
		DrawButton(1885 - I * 110, 15, 90, 90, "", ButtonColor, "Icons/" + ButtonImage + ".png", ButtonHoverText);
	}
	
	// Draws the color picker
	if (!FocusItem && DialogColor != null) {
		ElementPosition("InputColor", 1450, 65, 300);
		ColorPickerDraw(1300, 145, 675, 830, document.getElementById("InputColor"), function (Color) { DialogChangeItemColor(C, Color) });
		return;
	} else ColorPickerHide();

	// In item permission mode, the player can choose which item he allows other users to mess with.  Allowed items have a green background.  Disallowed have a red background. Limited have an orange background
	if ((DialogItemPermissionMode && (C.ID == 0) && (DialogProgress < 0 && !DialogLockPickOrder)) || (Player.CanInteract() && (DialogProgress < 0 && !DialogLockPickOrder) && !InventoryGroupIsBlocked(C, null, true))) {

		
		if (DialogInventory == null) DialogInventoryBuild(C);

		//If only activities are allowed, only add items to the DialogInventory, which can be used for interactions
		if (!DialogItemPermissionMode && InventoryGroupIsBlocked(C)) {
			var tempDialogInventory = [];
			for (let I = 0; I < DialogInventory.length; I++) {
				if ((DialogInventory[I].Asset.Name == "SpankingToys") && (C.FocusGroup.Name != "ItemHands")) tempDialogInventory.push(DialogInventory[I]);
			}
			if (tempDialogInventory.length > 0) {
				for (let I = 0; I < DialogInventory.length; I++) {
					if (DialogInventory[I].Worn) tempDialogInventory.push(DialogInventory[I]);
				}
			}
			DialogInventory = tempDialogInventory;
		}

		// Draw all possible items in that category (12 per screen)
		var X = 1000;
		var Y = 125;
		for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {
			const Item = DialogInventory[I];
			const Hover = MouseIn(X, Y, 225, 275) && !CommonIsMobile;
			const Background = AppearanceGetPreviewImageColor(C, Item, Hover);
			const Vibrating = Item.Worn && InventoryItemHasEffect(InventoryGet(C, Item.Asset.Group.Name), "Vibrating", true);
			const Hidden = CharacterAppearanceItemIsHidden(Item.Asset.Name, Item.Asset.Group.Name);

			if (Hidden) DrawPreviewBox(X, Y, "Icons/HiddenItem.png", Item.Asset.DynamicDescription(Player), { Background });
			else DrawAssetPreview(X, Y, Item.Asset, { C: Player, Background, Vibrating });

			if (Item.Icon != "") DrawImage("Icons/" + Item.Icon + ".png", X + 2, Y + 110);
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		if (DialogInventory.length > 0) {
			if (!DialogItemPermissionMode && InventoryGroupIsBlocked(C)) DrawText(DialogFindPlayer("ZoneBlocked"), 1500, 700, "White", "Black");
			return;
		}
	}

	// If the player is progressing
	if (DialogProgress >= 0) {
		DialogDrawStruggleProgress(C)
		return;
	}
	// If the player is lockpicking
	if (DialogLockPickOrder) {
		DialogDrawLockpickProgress(C)
		return;
	}






	// If we must draw the current item from the group
	if (FocusItem != null) {
		const Vibrating = InventoryItemHasEffect(FocusItem, "Vibrating", true);
		DrawAssetPreview(1387, 250, FocusItem.Asset, { C, Vibrating });
	}

	// Show the no access text
	if (InventoryGroupIsBlocked(C)) DrawText(DialogFindPlayer("ZoneBlocked"), 1500, 700, "White", "Black");
	else DrawText(DialogFindPlayer("AccessBlocked"), 1500, 700, "White", "Black");

}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it, error otherwise
 * @param {string} KeyWord - The key word to search for
 * @returns {string}
 */
function DialogFindPlayer(KeyWord) {
	const res = PlayerDialog.get(KeyWord);
	return res !== undefined ? res : `MISSING PLAYER DIALOG: ${KeyWord}`;
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it
 * @param {Character} C - The character whose dialog optio* 
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first 
 * keyword was not found.
 * @param {boolean} [ReturnPrevious] - If specified, returns the previous dialog, if neither of the the two key words were found
 ns should be searched
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog. 
 * An empty string is returned, if neither keyword was found and no previous dialog was given.
 */
function DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious) {
	for (let D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord1)
			return C.Dialog[D].Result.trim();
	if (KeyWord2 != null)
		for (let D = 0; D < C.Dialog.length; D++)
			if (C.Dialog[D].Stage == KeyWord2)
				return C.Dialog[D].Result.trim();
	return ((ReturnPrevious == null) || ReturnPrevious) ? C.CurrentDialog : "";
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it and replace the names
 * @param {Character} C - The character whose dialog options should be searched
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first
 * keyword was not found.
 * @param {boolean} [ReturnPrevious] - If specified, returns the previous dialog, if neither of the the two key words were found
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog.
 * An empty string is returned, if neither keyword was found and no previous dialog was given. 'SourceCharacter' 
 * is replaced with the player's name and 'DestinationCharacter' with the current character's name.
 */
function DialogFindAutoReplace(C, KeyWord1, KeyWord2, ReturnPrevious) {
	return DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious)
		.replace("SourceCharacter", Player.Name)
		.replace("DestinationCharacter", CharacterGetCurrent().Name);
}

/**
 * Draws the initial Dialog screen. That screen is entered, when the player clicks on herself or another player
 * @returns {void} - Nothing
 */
function DialogDraw() {
	if (ControllerActive == true) {
		ClearButtons();
	}
	// Draw both the player and the interaction character
	if (CurrentCharacter.ID != 0) DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);

	// Draw the menu for facial expressions if the player clicked on herself
	if (CurrentCharacter.ID == 0) {
<<<<<<< HEAD
		if (DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1) DrawButton(390, 50, 90, 90, "", "White", "Icons/Next.png", DialogFind(Player, "NextPage"));
=======
		if (DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1) DrawButton(420, 50, 90, 90, "", "White", "Icons/Next.png", DialogFindPlayer("NextPage"));
>>>>>>> upstream/master
		if (!DialogSelfMenuSelected)
			DialogDrawExpressionMenu();
		else
			DialogSelfMenuSelected.Draw();
	}

	// If we must show the item/inventory menu
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		var C = CharacterGetCurrent();

		// The view can show one specific extended item or the list of all items for a group
		if (DialogFocusItem != null) {
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else {
			if (DialogActivityMode) DialogDrawActivityMenu(C);
			else DialogDrawItemMenu(C);
		}

		// Draw the 'Up' reposition button if some zones are offscreen
		if (CurrentCharacter != null && CurrentCharacter.HeightModifier != null && CurrentCharacter.HeightModifier < -90 && CurrentCharacter.FocusGroup != null)
			DrawButton(510, 50, 90, 90, "", "White", "Icons/Up.png", DialogFindPlayer("UpPosition"));

	} else {

		// Draws the intro text or dialog result
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT")) {
			DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 840, 165, "white", null, 3);
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 950, 165, "white", null, 3);

		// Draws the possible answers
		var pos = 0;
		for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
				DrawTextWrap(SpeechGarble(Player, CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 90, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105) && !CommonIsMobile) ? "cyan" : "white", 2);
				pos++;
			}

		// The more time you spend with an NPC, the more the love will rise
		NPCInteraction();

	}

}

/**
 * Draw the menu for changing facial expressions
 * @returns {void} - Nothing
 */
function DialogDrawExpressionMenu() {

	// Draw the expression groups
<<<<<<< HEAD
	DrawText(DialogFind(Player, "FacialExpression"), 165, 25, "White", "Black");
	DrawButton(255, 50, 90, 90, "", "White", "Icons/WinkL.png", DialogFind(Player, "WinkLFacialExpressions"));
	DrawButton(155, 50, 90, 90, "", "White", "Icons/WinkR.png", DialogFind(Player, "WinkRFacialExpressions"));
	DrawButton(20, 50, 90, 90, "", "White", "Icons/Reset.png", DialogFind(Player, "ClearFacialExpressions"));
=======
	DrawText(DialogFindPlayer("FacialExpression"), 165, 25, "White", "Black");
	if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
		DrawButton(320, 50, 90, 90, "", "White", "Icons/ColorPick.png", DialogFindPlayer("ColorChange"));
	}
	DrawButton(220, 50, 90, 90, "", "White", "Icons/BlindToggle" + DialogFacialExpressionsSelectedBlindnessLevel + ".png", DialogFindPlayer("BlindToggleFacialExpressions"));
	const Expression = WardrobeGetExpression(Player);
	const Eye1Closed = Expression.Eyes === "Closed";
	const Eye2Closed = Expression.Eyes2 === "Closed";
	let WinkIcon = "WinkNone";
	if (Eye1Closed && Eye2Closed) WinkIcon = "WinkBoth";
	else if (Eye1Closed) WinkIcon = "WinkR";
	else if (Eye2Closed) WinkIcon = "WinkL";
	DrawButton(120, 50, 90, 90, "", "White", `Icons/${WinkIcon}.png`, DialogFindPlayer("WinkFacialExpressions"));
	DrawButton(20, 50, 90, 90, "", "White", "Icons/Reset.png", DialogFindPlayer("ClearFacialExpressions"));
>>>>>>> upstream/master
	if (!DialogFacialExpressions || !DialogFacialExpressions.length) DialogFacialExpressionsBuild();
	for (let I = 0; I < DialogFacialExpressions.length; I++) {
		const FE = DialogFacialExpressions[I];
		const OffsetY = 185 + 100 * I;
<<<<<<< HEAD

		DrawButton(20, OffsetY, 90, 90, "", I == DialogFacialExpressionsSelected ? "Cyan" : "White", "Assets/Female3DCG/" + FE.Group + (FE.CurrentExpression ? "/" + FE.CurrentExpression : "") + "/Icon.png");

=======

		DrawButton(20, OffsetY, 90, 90, "", I == DialogFacialExpressionsSelected ? "Cyan" : "White", "Assets/Female3DCG/" + FE.Group + (FE.CurrentExpression ? "/" + FE.CurrentExpression : "") + "/Icon.png");

>>>>>>> upstream/master
		// Draw the table with expressions
		if (I == DialogFacialExpressionsSelected) {
			for (let j = 0; j < FE.ExpressionList.length; j++) {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				DrawButton(EOffsetX, EOffsetY, 90, 90, "", (FE.ExpressionList[j] == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Group + (FE.ExpressionList[j] ? "/" + FE.ExpressionList[j] : "") + "/Icon.png");
			}
		}
	}
}

/**
 * Handles clicks in the dialog expression menu.
 * @returns {void} - Nothing
 */
function DialogClickExpressionMenu() {
	if (MouseIn(20, 50, 90, 90)) {
		DialogFacialExpressions.forEach(FE => {
<<<<<<< HEAD
			CharacterSetFacialExpression(Player, FE.Group);
			FE.CurrentExpression = null;
		});
	} else if (MouseIn(155, 50, 90, 90)) {
		const EyesExpression = WardrobeGetExpression(Player);
		const CurrentExpression = DialogFacialExpressions.find(FE => FE.Group == "Eyes").CurrentExpression;
		CharacterSetFacialExpression(Player, "Eyes1", (EyesExpression.Eyes !== "Closed") ? "Closed" : (CurrentExpression !== "Closed" ? CurrentExpression : null));
	} else if (MouseIn(255, 50, 90, 90)) {
		const EyesExpression = WardrobeGetExpression(Player);
		const CurrentExpression = DialogFacialExpressions.find(FE => FE.Group == "Eyes").CurrentExpression;
		CharacterSetFacialExpression(Player, "Eyes2", (EyesExpression.Eyes2 !== "Closed") ? "Closed" : (CurrentExpression !== "Closed" ? CurrentExpression : null));
=======
			let Color = null;
			if (FE.Appearance.Asset.Group.AllowColorize && FE.Group !== "Eyes") Color = "Default";
			CharacterSetFacialExpression(Player, FE.Group, null, null, Color);
			FE.CurrentExpression = null;
		});
		if (DialogExpressionColor != null) ItemColorSaveAndExit();
	} else if (MouseIn(120, 50, 90, 90)) {
		const CurrentExpression = DialogFacialExpressions.find(FE => FE.Group == "Eyes").CurrentExpression;
		const EyesExpression = WardrobeGetExpression(Player);
		const LeftEyeClosed = EyesExpression.Eyes2 === "Closed";
		const RightEyeClosed = EyesExpression.Eyes === "Closed";
		if (!LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", "Closed", null);
		else if (LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes", "Closed", null);
		else if (LeftEyeClosed && RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
		else CharacterSetFacialExpression(Player, "Eyes", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
	} else if (MouseIn(220, 50, 90, 90)) {
		DialogFacialExpressionsSelectedBlindnessLevel += 1;
		if (DialogFacialExpressionsSelectedBlindnessLevel > 3)
			DialogFacialExpressionsSelectedBlindnessLevel = 1;
	} else if (MouseIn(320, 50, 90, 90)) {
		if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
			const GroupName = DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.Name;
			const Item = InventoryGet(Player, GroupName);
			const originalColor = Item.Color;
			Player.FocusGroup = AssetGroupGet(Player.AssetFamily, GroupName);
			DialogColor = "";
			DialogExpressionColor = "";
			ItemColorLoad(Player, Item, 1200, 25, 775, 950, true);
			ItemColorOnExit((save) => {
				DialogColor = null;
				DialogExpressionColor = null;
				Player.FocusGroup = null;
				if (save && !CommonColorsEqual(originalColor, Item.Color)) {
					ServerPlayerAppearanceSync();
					ChatRoomCharacterItemUpdate(Player, GroupName);
				}
			});
		}
>>>>>>> upstream/master
	} else {
		// Expression category buttons
		for (let I = 0; I < DialogFacialExpressions.length; I++) {
			if (MouseIn(20, 185 + 100 * I, 90, 90)) {
				DialogFacialExpressionsSelected = I;
<<<<<<< HEAD
=======
				if (DialogExpressionColor != null) ItemColorSaveAndExit();
>>>>>>> upstream/master
			}
		}

		// Expression table
		if (DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length) {
			const FE = DialogFacialExpressions[DialogFacialExpressionsSelected];
			for (let j = 0; j < FE.ExpressionList.length; j++) {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				if (MouseIn(EOffsetX, EOffsetY, 90, 90)) {
					CharacterSetFacialExpression(Player, FE.Group, FE.ExpressionList[j]);
					FE.CurrentExpression = FE.ExpressionList[j];
				}
			}
		}
	}
}

/**
 * Draws the pose sub menu
 * @returns {void} - Nothing
 */
function DialogDrawPoseMenu() { 
	// Draw the pose groups
	DrawText(DialogFindPlayer("PoseMenu"), 250, 100, "White", "Black");

	if (!DialogActivePoses || !DialogActivePoses.length) DialogActivePoseMenuBuild();
	
	for (let I = 0; I < DialogActivePoses.length; I++) { 
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];
		
		for (let P = 0; P < PoseGroup.length; P++) { 
			var OffsetY = 180 + 100 * P;
			var IsActive = false;
			
			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			else if (Array.isArray(Player.ActivePose)) {
				if (Player.ActivePose.includes(PoseGroup[P].Name))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseUpper" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyUpper" || Pose.Category == "BodyFull"))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseLower" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyLower" || Pose.Category == "BodyFull"))
					IsActive = true;
			}
			else if ((PoseGroup[P].Name == "BaseUpper" || PoseGroup[P].Name == "BaseLower") && Player.ActivePose == null)
				IsActive = true;
			DrawButton(OffsetX, OffsetY, 90, 90, "", !Player.CanChangeToPose(PoseGroup[P].Name) ? "#888" : IsActive ? "Pink" : "White", "Icons/Poses/" + PoseGroup[P].Name + ".png");
		}
	}
}

/**
 * Handles clicks in the pose sub menu
 * @returns {void} - Nothing
 */
function DialogClickPoseMenu() {
	for (let I = 0; I < DialogActivePoses.length; I++) { 
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];
		for (let P = 0; P < PoseGroup.length; P++) { 
			var OffsetY = 180 + 100 * P;
			var IsActive = false;
			
			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			if (Array.isArray(Player.ActivePose) && Player.ActivePose.includes(PoseGroup[P].Name))
				IsActive = true;
			
			if (MouseIn(OffsetX, OffsetY, 90, 90) && !IsActive && Player.CanChangeToPose(PoseGroup[P].Name)) {
				CharacterSetActivePose(Player, PoseGroup[P].Name);
				if (CurrentScreen == "ChatRoom") ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
			}
		}
	}
}


/**
 * Sets the current character sub menu to the owner rules
 * @returns {void} - Nothing
 */
function DialogViewOwnerRules() { 
	DialogSelfMenuSelected = DialogSelfMenuOptions.find(M => M.Name == "OwnerRules");
}

/**
 * Draws the owner rules sub menu
 * @returns {void} - Nothing
 */
function DialogDrawOwnerRulesMenu() { 
	// Draw the pose groups
	DrawText(DialogFindPlayer("OwnerRulesMenu"), 230, 100, "White", "Black");

	var ToDisplay = [];
	
	if (LogQuery("BlockOwnerLockSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockOwnerLockSelf" });
	if (LogQuery("BlockChange", "OwnerRule")) ToDisplay.push({ Tag: "BlockChange", Value: LogValue("BlockChange", "OwnerRule") });
	if (LogQuery("BlockWhisper", "OwnerRule")) ToDisplay.push({ Tag: "BlockWhisper" });
	if (LogQuery("BlockKey", "OwnerRule")) ToDisplay.push({ Tag: "BlockKey" });
	if (LogQuery("BlockRemote", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemote" });
	if (LogQuery("BlockRemoteSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemoteSelf" });
	if (LogQuery("ReleasedCollar", "OwnerRule")) ToDisplay.push({ Tag: "ReleasedCollar" });
	if (ToDisplay.length == 0) ToDisplay.push({ Tag: "Empty" });
	
	for (let I = 0; I < ToDisplay.length; I++) { 
		var OffsetY = 230 + 100 * I;
		DrawText(DialogFindPlayer("OwnerRulesMenu" + ToDisplay[I].Tag) + (ToDisplay[I].Value ?  " " + TimerToString(ToDisplay[I].Value - CurrentTime) : ""), 250, OffsetY, "White", "Black");
	}
}

/**
 * Sets the skill ratio for the player, will be a % of effectiveness applied to the skill when using it. 
 * This way a player can use only a part of her bondage or evasion skill.
 * @param {string} SkillType - The name of the skill to influence
 * @param {strign} NewRatio - The ration of this skill that should be used
 * @returns {void} - Nothing
 */
function DialogSetSkillRatio(SkillType, NewRatio) {
	SkillSetRatio(SkillType, parseInt(NewRatio) / 100);
}

/**
 * Sends an room administrative command to the server for the chat room from the player dialog
 * @param {string} ActionType - The name of the administrative command to use 
 * @param {string} Publish - Determines wether the action should be published to the ChatRoom. As this is a string, use "true" to do so
 * @returns {void} - Nothing
 */
function DialogChatRoomAdminAction(ActionType, Publish) {
	ChatRoomAdminAction(ActionType, Publish);
}

/**
 * Checks if a chat room player swap is in progress
 * @returns {boolean} - Returns true, if a swap is in progress, false otherwise
 */
function DialogChatRoomHasSwapTarget() {
	return ChatRoomHasSwapTarget();
}

/**
 * Leave the dialog and revert back to a safe state, when the player uses her safe word
 * @returns {void} - Nothing
 */
function DialogChatRoomSafewordRevert() {
	DialogLeave();
	ChatRoomSafewordRevert();
}

/**
 * Leave the dialog and release the player of all restraints before returning them to the Main Lobby
 * @returns {void} - Nothing
 */
 function DialogChatRoomSafewordRelease() {
 	DialogLeave();
 	ChatRoomSafewordRelease();
 }

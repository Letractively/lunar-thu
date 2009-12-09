///////////////////////////////////////
// 
// SmartMe-Buildin-Script.js
//
//
//
///////////////////////////////////////
// Author: TT @ Lunar
// Time:  2009/12/9
// 
// Modify History:
// 

// Load SmartMe Code lib
// 				(Run Once)
//
// Uri: Document Uri

/////////////////////////////////
// Class _SmartMeGlobal
function _SmartMeGlobal() {
	// _SmartMeGlobal member variables
	this._isInitialized = false;
	this._url = "";
	this._return = [];
};
// _SmartMeGlobal member functions
_SmartMeGlobal.prototype.console = function(str) { 
	if (console != null && console.log != null ) {
		console.log(str);
	}
	else {
		alert(str); 
	}
};
_SmartMeGlobal.prototype.error = function(str) { 
	this.console("Error:" + str);
};

// return: bool 
// 		true: bind success
//      false: bind failure
_SmartMeGlobal.prototype.bind = function(name, handler) {
	if ( ! (this[name] == undefined) ) {
		return false;
	}
	this[name] = handler;
	return true;
};

// no return
_SmartMeGlobal.prototype.unbind = function(name) {
	this[name] = undefined;
};
//:~ Class _SmartMeGlobal
///////////////////////

//////////////////////////////////
// Define Global Variable:
var $_S = new _SmartMeGlobal();

//////////////////////////////////


/////////////////////////////////////////
// SmartMe API:
//

//////////////////////////
// Class SmartMeItem
function SmartMeItem (title, linkUrl, content, similarUrl, cachedUrl) {
	this.title = title;
	this.linkUrl = linkUrl;
	this.content = content;
	this.similarUrl = similarUrl;
	this.cachedUrl = cachedUrl;
};
//:~ Class _SmartMeItem 
//////////////////////////

// return smartMeItem
function SmartMe_CreateItem(title, linkUrl, content, similarUrl, cachedUrl) {
	return new SmartMeItem(title, linkUrl, content, similarUrl, cachedUrl);
};

function SmartMe_AddItem(smartMeItem) {
	$_S._return.push(smartMeItem);
};

function SmartMe_RemoveItems() {
	$_S._return = [];
};

function SmartMe_PrintItems() {
	$_S.console($_S._return);
};


$_S.bind("CreateItem", SmartMe_CreateItem);
$_S.bind("AddItem", SmartMe_AddItem);
$_S.bind("RemoveItems", SmartMe_RemoveItems);
$_S.bind("PrintItems", SmartMe_PrintItems);

function test() {
	alert("test");
}

if (document != null && document.getElementById != null) {
	$_S.bind("G", function (id) {
			return document.getElementById(id);
		}
	);
}

var $S = $_S;

/////////////////////////////////////////////
// Test Function:

function Run() {
	for (var i = 0; i < 3; i++) {
		var item = $S.CreateItem("title" + i, "linkUrl" + i, "content" + i, "similarUrl" + i, "cachedUrl" + i);
		$S.AddItem(item);
	}
	$S.PrintItems();
	$S.RemoveItems();
	$S.PrintItems();
}

/////////////////////////////////////////////
//

Run();
//
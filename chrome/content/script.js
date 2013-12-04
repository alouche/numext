var numExt =
{
	checkExeBox : 0,
	
	curTabs : "",
	
	curTabsCount : 0,
	
	currentVersion : "",
	
	numSeperator : "",
	
	numNumb : "",
	
	stringRegex : "",
	
	regkey: "",
	
	numAssistant : "",
	
	oldSep: null,
	
	init : function()
	{	

		var numExtPrefNumb = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
		numExtPrefNumb =  numExtPrefNumb.getBranch ("extensions.numext.");
		numExt.numNumb = numExtPrefNumb.getCharPref("numNumb");	
		
		var statuslb = document.getElementById("statuslb");
		statuslb.setAttribute( 'value', 'NumExt (' + numExt.numNumb + ')');
		
		if (numExt.numNumb == "on")
		{
			var content = document.getElementById("content");
			numExt.curTabs = content.mTabs;
			numExt.curTabsCount = numExt.curTabs.length;
		
			var numExtPrefSep = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
			numExtPrefSep =  numExtPrefSep.getBranch ("extensions.numext.");
			numExt.numSeperator = numExtPrefSep.getCharPref("numSeperator");

			if (numExt.oldSep != null)
			{
				numExt.stringRegex = "^\\d{1,1000}" + numExt.oldSep + "  ";
				numExt.oldSep = null;
			}
			else
			{
				numExt.stringRegex = "^\\d{1,1000}" + numExt.numSeperator + "  ";
			}
		
			numExt.regkey = new RegExp(numExt.stringRegex);
			var doc = null;
			for (var i = 0; i < numExt.curTabsCount; i++) 
			{ 
				doc = numExt.curTabs[i].label.replace(numExt.regkey, '');
				numExt.curTabs[i].label = (i + 1) + numExt.numSeperator + "  " + doc;
			}
		}
	},
	
	//resetNum was added as an extra function to avoid calling having init parse tabs title when numbering is off / so that resetNum is only called once... it is an overlay function but it keeps it light on the user's browser

	resetNum : function()
	{
		var content = document.getElementById("content");
		numExt.curTabs = content.mTabs;
		numExt.curTabsCount = numExt.curTabs.length;
		var doc = null;
		
		numExt.stringRegex = "^\\d{1,1000}" + numExt.numSeperator + "  ";
		
		numExt.regkey = new RegExp(numExt.stringRegex);
		
		for (var i = 0; i < numExt.curTabsCount; i++) 
		{ 
			doc = numExt.curTabs[i].label.replace(numExt.regkey, '');
			numExt.curTabs[i].label = doc;
		}	
	},
	
	loadSett : function()
	{
		var numExtPref = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
		numExtPref =  numExtPref.getBranch ("extensions.numext.");
		var shortCutKey = null;
		shortCutKey = numExtPref.getCharPref ("execKey");					
		var jumpbar1 = document.getElementById( 'jumpbar' );
		jumpbar1.setAttribute( 'key', shortCutKey);
		
		var ver = -1, firstrun = true;
		var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
		numExt.currentVersion = gExtensionManager.getItemForID("numext@alouche.net").version;
		
		try
		{
			ver = numExtPref.getCharPref("version");
			firstrun = numExtPref.getBoolPref("firstrun");
		}
		catch(e)
		{
		}
		finally
		{
			if (firstrun)
			{
				numExtPref.setBoolPref("firstrun",false);
				window.setTimeout(function()
				{
					gBrowser.selectedTab = gBrowser.addTab("http://numext.alouche.net/howto/");
				}, 1500);
			}			
      
			if (ver!=numExt.currentVersion)
			{
				numExtPref.setCharPref("version",numExt.currentVersion);
				window.setTimeout(function()
				{
					gBrowser.selectedTab = gBrowser.addTab("http://numext.alouche.net/changelog/?ver="+numExt.currentVersion);
				}, 1500);
			}
		}
		window.removeEventListener("load",function(){ numExt.loadSett(); },true);
	},

	switchCmdB : function()
	{
		var cmdBExePanel = document.getElementById( 'cmdBExePanel' );
		var parserCmd = document.getElementById( 'parserCmd' );
		
		var numExtAssist = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
		numExtAssist =  numExtAssist.getBranch ("extensions.numext.");
		numExt.numAssistant = numExtAssist.getCharPref ("numAssistant");
		
		if (numExt.checkExeBox == 0)
		{
			cmdBExePanel.setAttribute( 'hidden', 'false');
			if (numExt.numAssistant == "off")
				parserCmd.setAttribute( 'hidden', 'true');
			else
				parserCmd.setAttribute( 'hidden', 'false');
			numExt.checkExeBox = 1;
		}
		else
		{
			cmdBExePanel.setAttribute( 'hidden', 'true');
			parserCmd.setAttribute( 'hidden', 'true');
			numExt.checkExeBox = 0;
		}
	
		document.getElementById( 'cmdExeTb' ).focus();
		document.getElementById( 'cmdExeTb' ).select();
	},
	
	switchCmdBExe : function()
	{
		var txtbstring = document.getElementById( 'cmdExeTb' ).value;
	
		var command = txtbstring.split(" ");
			
		if (isNaN(command[0]))
		{
			switch (command[0])
			{
				case "help":
					var new_tab = gBrowser.addTab("http://numext.alouche.net/howto");
					gBrowser.selectedTab = new_tab;			
				break;
			
				case "update":
					var new_tab = gBrowser.addTab("http://numext.alouche.net/index.php?version="+numExt.currentVersion);
					gBrowser.selectedTab = new_tab;			
				break;
				
				case "open":
					var new_tab = gBrowser.addTab(command[1]);
					gBrowser.selectedTab = new_tab;			
				break;
			
				case "hide":
					if (command[1] && numExt.curTabs[command[1] - 1].style.display!='none' )
					{
						numExt.curTabs[command[1] - 1].style.display='none';
					}
					else if (!command[1])
					{
						var new_tab = gBrowser.addTab("http://google.com");
						gBrowser.selectedTab = new_tab;
						gBrowser.setStripVisibilityTo(false);
					}
				break;

				case "show":
					if (command[1] && numExt.curTabs[command[1] - 1].style.display=='none' )
					{
						numExt.curTabs[command[1] - 1].style.display='';
					}
					else if (!command[1])
					{
						gBrowser.setStripVisibilityTo(true);						
					}
				break;

				case "close":
					if (command[1])
					{
						var tmp = command[1].split(":");
						if (tmp[1])
						{
							// check min/max : max/min
							if (tmp[1] <= numExt.curTabsCount)
							{
								for (var j = tmp[0]; j <= tmp[1]; j++)
								{
									gBrowser.removeTab(numExt.curTabs[tmp[0]-1]);
								}
							}
							else
							{
								alert("The number of current open tabs is inferior to the maximum of the range you provided");
							}
						}
						else
						{
							tmp = 1000000000000000000000000; // let's hope no one open that much amount of tabs ;-)
							var counter =0;
							for (var j = 1; j < command.length; j++)
							{
								var indexTab = 0;
								for (var i = counter; i > 0; i--)
								{
									if (command[j] > command [j-i])
										indexTab++;
								}
								indexTab = command[j] - indexTab;
								if (indexTab <= numExt.curTabsCount)
								{
									gBrowser.removeTab(numExt.curTabs[indexTab-1]);
								}
								else
								{
								//	alert("Oups... tab number "+ indexTab + " does not exist :)");
								}
								counter = counter + 1;
								tmp = command[j];
							}
						}
					}
					else
					{
						gBrowser.removeTab(gBrowser.selectedTab);
					}
				break;

				case "title":
					var tmp=" ";
					var index = 0;
					var prefIndex = 0;
					
					if (isNaN(command[1]))
					{
						index = 1;
						prefIndex = gBrowser.tabContainer.selectedIndex;
						
					}
					else
					{
						index = 2;
						prefIndex = command[1] - 1;
					}
					
					for (var j = index; j < command.length; j++)
					{
						tmp = tmp + command[j] + " ";
					}
					
					numExt.curTabs[prefIndex].label = tmp;
					
					window.setTimeout(numExt.init, 5);
				break;
			
				case "nocol":
					if (isNaN(command[1]))
					{
						gBrowser.selectedTab.style.removeProperty('background-color');
						gBrowser.selectedTab.style.removeProperty('color');
					}
					else
					{
						numExt.curTabs[(command[1] -1)].style.removeProperty('background-color');
						numExt.curTabs[(command[1] -1)].style.removeProperty('color');						
					}
				break;
			
				case "reload":
					if (command[1])
					{				
						gBrowser.reloadTab( numExt.curTabs[(command[1] -1)] );				
					}
					else
					{
						gBrowser.reloadTab( gBrowser.selectedTab );			
					}
				break;
			
				case "col":
					var numExtPrefCol = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
					numExtPrefCol =  numExtPrefCol.getBranch ("extensions.numext.");
					var colorArgv = command.length - 1;
					var colorUserSet = null;
					var colorWhat = command.length - 2;
					var whatUserSet = "background-color";
					if (command[colorArgv] == "a" || command[colorArgv] == "b" || command[colorArgv] == "c" || command[colorArgv] == "d" || command[colorArgv] == "e")
					{
						colorUserSet = numExtPrefCol.getCharPref ("aliasColor" + command[colorArgv]);					
					}
					else
					{
						colorUserSet = 	command[colorArgv];			
					}
					if (command[colorWhat] == "title")
					{
						whatUserSet	= "color";			
					}	
					if (isNaN(command[1]))
					{
						if (command[1] == "alias")
						{
							numExtPrefCol.setCharPref ("aliasColor" + command[2], command[3]);		
						}
						else
						{
							gBrowser.selectedTab.style.setProperty('-moz-appearance','none','important');
							gBrowser.selectedTab.style.setProperty(whatUserSet,colorUserSet,'important');
						}
					}
					else
					{
						numExt.curTabs[(command[1] -1)].style.setProperty('-moz-appearance','none','important');
						numExt.curTabs[(command[1] -1)].style.setProperty(whatUserSet,colorUserSet,'important');							
					}
				break;
				
				case "nonum":
					var numExtPrefNumb = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
					numExtPrefNumb  = numExtPrefNumb.getBranch ("extensions.numext.");
					numExtPrefNumb.setCharPref("numNumb", "off");
					this.init();
					this.resetNum();
				break;
				
				case "num":
					if (numExt.numNumb == "off")
					{
						var numExtPrefNumb = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
						numExtPrefNumb  = numExtPrefNumb.getBranch ("extensions.numext.");
						numExtPrefNumb.setCharPref("numNumb", "on");
						this.init();
					}
				break;
				
				case "execkey":
					if (isNaN(command[1]) && command[1].length == 1)
					{
						var numExtPrefExe = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
						numExtPrefExe =  numExtPrefExe.getBranch ("extensions.numext.");
						numExtPrefExe.setCharPref ("execKey", command[1]);
						alert("NumExt (exec) shortcut key has been changed to Alt + " + command[1] + "\nYou need to first restart Firefox for changes to take effect");
					}
					else
					{
						alert("hmm, you need to type in a letter/number (one digit) to set your shortcut");
					}
				break;
				
				case "sep":
					if (command[1] == "\\" || command[1] == "|" || command[1] == "^" || command[1] == "?")
					{
						alert("Sorry the following carachters aren't allowed \\ | ^ ? ");
					}
					else
					{
						var tmp = "";
						for (var j = 1; j < command.length; j++)
						{
							tmp = tmp + command[j] + " ";
						}
						var numExtPrefSep = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
						numExtPrefSep =  numExtPrefSep.getBranch ("extensions.numext.");
						numExt.oldSep = numExtPrefSep.getCharPref("numSeperator");
						numExtPrefSep.setCharPref ("numSeperator", tmp);
						this.init();
					}
				break;
				
				case "assist":
					if (command[1] == 'on' || command[1] == 'off')
					{
						var numExtPrefAssist = Components.classes["@mozilla.org/preferences-service;1"].getService (Components.interfaces.nsIPrefService);
						numExtPrefAssist  = numExtPrefAssist.getBranch ("extensions.numext.");
						numExtPrefAssist.setCharPref("numAssistant", command[1]);
					}
					else
					{
						alert('Please type either on/off to activate/desactive the NumExt Assistant');
					}
				break;
				
				default:
					if (confirm("The command you entered was ambigious... would you like to consult the help manual?")) 
					{
    					var new_tab = gBrowser.addTab("http://numext.alouche.net/howto");
						gBrowser.selectedTab = new_tab;
  					}
				break;
			}
		}
		else
		{
			this.selectTabNum(command[0] - 1);
		}
		
		this.switchCmdB();
	},
	
	selectTabNum: function(selectNumTab)
	{
		gBrowser.mTabContainer.selectedIndex = selectNumTab;	
	},
	
	showParser: function()
	{
		if (numExt.numAssistant == "on")
		{
			var commandsList = new Array ("help","update","open","hide","show","title","col","nocol","reload","num","nonum","execkey","sep","close","assist");
			var parserCmd = document.getElementById( 'parserCmd' );
			var typing = document.getElementById('cmdExeTb').value;
			var assistantOutput = "#type 'assit off' to turn off the assistant - #type help and press enter // or start typing a command to have the assistant display some hints";
			typing = typing.split(" ");
			var suggestionCmd = " ";
			var existCmd = 0;
		
			if (typing[0] != "")
			{
				for (i=0;i<commandsList.length;i++)
				{
					if (commandsList[i].indexOf(typing[0]) == 0)
					{
						suggestionCmd = suggestionCmd + commandsList[i] + " ";
						existCmd = 1;
					}
				}
			
				if (existCmd == 0)
					assistantOutput = "I don't understand what you typed. Type 'help' for a list of available commands";
				else
					assistantOutput = "Hmm I don't understand what you are typing. I would like to suggest the following commands: " + suggestionCmd;

				switch (typing[0])
				{	
					case "help":
						assistantOutput = " 'help' [list available commands]";
					break;
				
					case "update":
						assistantOutput = " 'update' [verify if you have the latest version of NumExt] , there are no arguments to the command, press 'enter'";
					break;
				
					case "open":
						assistantOutput = " 'open' [open a new tab with the desired url] - Type 'open http://google.com'";
					break;

					case "hide":
						assistantOutput = " 'hide' [hide a tab] - Type 'hide' to hide all tabs or 'hide 3' to hide tab number 3";
					break;
				
					case "show":
						assistantOutput = " 'show' [show a tab which was previously hidden] - Type 'show' to hide all tabs or 'show 3' to show tab number 3";
					break;
					
					case "title":
						assistantOutput = " 'title' [change the title of the specified tab] - Type 'title MyCustomTab' to change the tab title of the current tab or 'title 3 MyCustomTab' to change the title of tab Nr. 3";
					break;
				
					case "col":
						assistantOutput = " 'col' [color your tabs] - Optional Arguments {'alias','title'} - Further more usage on the col command is available in the NumExt HowTo";
						if (typing[1] == "alias")
						{
							assistantOutput = " 'col alias' [set a custom color to any alias (a, b, c, e, f)] - Exp: 'col alias a blue' or 'col alias a #FF456D";
							if (typing[2] == "a" || typing[2] == "b" || typing[2] == "c" || typing[2] == "d" || typing[2] == "e" )
								assistantOutput = " 'col alias "+typing[2]+"' , now, type the name of a color as in 'blue, red, #FFGBH'";
						}
						else if (typing[1] == "title")
							assistantOutput = " 'col title', type now the tab ID number, you currently have "+numExt.curTabsCount+" tabs opened - if you wish to select the current tab, just press enter";
											break;
				
					case "nocol":
						assistantOutput = typing[0] + " 'nocol' [reset the coloring of your tabs] - Type, 'nocol' and press enter";
					break;
				
					case "reload":
						assistantOutput = " 'reload' [reload a tab] - Type 'reload 3' to reload the tab 3 or 'reload' to reload the current page";
					break;
				
					case "num":
						assistantOutput = " 'num' [turns back numbering on] - Type 'num'";
					break;

					case "nonum":
						assistantOutput = " 'nonum' [removes the numbering from the tabs] - Type 'nonum' to temporarely turn off the numbering";
					break;
				
					case "execkey":
						assistantOutput = " 'execkey' [set a different shortcut key to enable the NumExt command parse box] - Type 'execkey Y' to set the shortcut key to 'Alt + Y'";
					break;
				
					case "sep":
						assistantOutput = " 'sep' [set a different numbering seperator] - Type 'sep #' to set the tab numbering as in '3#' or 'sep .' for '3.'";
					break;
				
					case "close":
						assistantOutput = " 'close' [close a tab] - Type 'close 3' to close tab number 3 or 'close' to close your current tab";
					break;
				
					case "assist":
						assistantOutput = " 'assist' [turns on or off the NumExt command assistant] - Type 'assist off' to turn off this assitant and later 'assist on' to turn it back on.";
					break;
				}
			}
			parserCmd.setAttribute( 'value', 'NumExt (Assistant) :: ' + assistantOutput);
		}
	}
}

window.addEventListener("TabOpen", function () { window.setTimeout(numExt.init, 5); }, false);
window.addEventListener("TabClose", function () { window.setTimeout(numExt.init, 5); }, false);
window.addEventListener("load", function () { gBrowser.addEventListener("load", function(){window.setTimeout(numExt.init, 5);}, true); }, true);
window.addEventListener("load", function(e) { numExt.loadSett(); }, false); 

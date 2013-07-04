ServerIP
========

Simple chrome extension that gives the IP address of the server being connected to, similar to ShowIP for Firefox. A difference from ShowIP is that Chrome does not leave enough room to automatically show the full IP address. For this reason just the last segment is shown automatically but the full IP address is available by clicking on the icon.

An alternative to showing the last segment of the IP address is to show a three letter mnemonic instead. See options to assign mnemonics.

See license file for MIT License.

Change log
----------
#### 2.2.0

* Added an option to make the on-page full IP display stay still when hovered over
* Added colors for ServerIP badge mnemonic/number and corresponding on-page IP display
* Sorted mnemonics on options page
* Added icons
* Reduced the amount of flicker while multiple windows or tabs loaded at the same time
* Changed saving mechanism to save on valid entry's keyup
		
#### 2.1.1

* Fixed bug that occurred when Hover box was not added to document but attempted to have its text changed

#### 2.1.0

* Added on-page full IP display and option to show it by default or not
* Changed extension click to toggle on-page full IP display
* Fixed bug that showed wrong IP when switching from one window to another
* Added this change log :)

#### 2.0.0

* Added options page to allow for abbreviations to be added instead of last three of IP
* Also made it manifest 2 compliant

#### 1.1.0

* Added warning for then-needed Developer channel version of chrome to use web request as non-experimental

#### 1.0.1

* Added error messages and try, catch for localStorage

#### 1.0.0

* Initial release


Outstanding bugs
----------------


Outstanding improvements
------------------------
* Figure out how to load configuration variables (mnems and sips) when changed rather than when used.
* Add wild cards, at least * (star - all), to the IP addresses on the mnemonic options.
* Ability to export mnemonic / IP pairs for loading into another machine, chrome canary, or co-worker's machine

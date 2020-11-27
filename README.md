# mimic.js - a public library

## About
One night I was tinkering a Javascript Date object prototype to write a method called "calcAge()" which calculates the age given a date of birth (a Date object). Then I started writing more custom Object/Class methods for Object, HTMLElement and its sub classes, and so on. The purpose of this library (I hope I'm right to call it a library) is "less writing". For example, there might be a program which requires you to call *document.getElementsById()* so many times. I just wanted to simplify the method name like below:
```
document.__$id() // double-underscore
```
for document.getElementsByTagName is like:
```
document.__$tag()
```
I borrowed some ideas from JS frameworks or other programming languages. There are no reasons why it was the prototypes to be tinkered. I just want to see how it goes.


## Method Naming Convention
In an attempt to distinguish the methods from others, method names start with a double-underscore. I regard some of the methods as "special". They have a dollar-sign ($) after the double-underscore.


## Method notations (Return Types, Parameter Types)
(in the source file) The format is:
```
/*@returnType*/
Objec/ClassName.prototype.__methodName = function (/*@arg1Type*/ arg1, [/*@arg2Type*/ arg2...]) {
    // method body
}
```
It's not a must to comply with the argument types. It's just a recommendation.

## Method lists
|Object/Class Name| Mothod|Equivalent to|
|---|---|---|
|Object| | |
||Object.prototype.__isStringNonObjectValuePair (mixed arg1, mixed arg2) : boolean|N/A - This is used to check the argment is a key/value pair.|
||Object.prototype.__isObjectArgument (mixed arg1) : boolean|N/A|
|HTMLDocument / HTMLElement|||
||HTMLDocument.prototype.__$id = function (string elementId) : HTMLElement|document.getElementById ()|
||HTMLDocument.prototype.__$query = function (string selector) : HTMLElement|document.querySelector ()|
||HTMLDocument.prototype.__$queryAll (string selector) : NodeList|document.querySelectorAll ()|
||HTMLDocument.prototype.\_\_$tag = HTMLElement.prototype.__$tag = function (string tagName) : HTMLCollection|document.getElementsByTagName ()|
||HTMLDocument.prototype.\_\_$class = HTMLElement.prototype.__$class = function (string className) : HTMLCollection|document.getElementsByClassName ()|
||HTMLDocument.prototype.\_\_appendChildren = HTMLElement.prototype.__appendChildren = function (array\|HTMLElementCollection children)|N/A - Modified version of appendChild ()|
|HTMLElement|||
||HTMLElement.prototype.__attr = function (...varargs) : HTMLElement| htmlElement.setAttribute () or JQuery.attr ()|
||HTMLElement.prototype.__css (...varargs) : HTMLElement|JQuery.css()|
||HTMLElement.prototype.__text (string newText=undefined)  : HTMLElement\|string|JQuery.text ()|
||HTMLElement.prototype.__html (string newHTML=undefined) : HTMLElementC\|string|JQuery.html ()|
|HTML UL/OL istElement|||
||HTMLUListElement.prototype.\_\_populate = HTMLOListElement.prototype.__populate = function (array listData, function callback=undefined) : HTMLUListElement|N/A - Polulate the list element. Callback can be used, for example. to style the list items.|
|HTMLTableElement|||
||HTMLTableElement.prototype.__populate (array tableHeaders, array (2D) tableData, function callback=undefined) : HTMLTableElement|N/A - Populate the table element.|
||HTMLTableElement.prototype.__sort (HTMLTableCellElement (TH) headerElement, int columnIndex) : void|NA - Sort table data by column|
|HTMLInputElement|||
||HTMLInputElement.prototype.__val(newValue=undefiened) : string\|HTMLInputElement |JQuery.val ()|
|HTMLCollection|||
||HTMLCollection.prototype.__toArray (void) : array|N/A (uses Array.prototype.slice.call)|
|Array||
||Array.\_\_proto__.__range = function (int start, int end, int step = 1) : array | Python.range() - Object method|
|Date|
||Date.prototype.__calcAge (void) : int|N/A|
||Date.prototype.__numDays (void) : unsigned int|N/A - Instance method|
||Date.\_\_proto__.numdays (unsigned int month, unsigned int year=undefined) : unsigned int|N/A - Object method|
|String|||
||String.prototype.__isNumber (void) : bool|N/A - Checks if the string is a valid number|
||String.prototype.__ucfirst (void) : string|N/A - Uppercase the first letter| 
|JSON|||
||JSON.\_\_proto__.__get = async (@string url) : Promise|N/A - uses fetch () and Promise ()|

## Usage (Example)
```
var table = document.createElement ("table")
    .__attr({ border : "1" })
    .__populate (
        ["Header 1", "Header 2" [, ...]], // table headers
        [   // table rows and cells
            ["Row 1 - Cell 1", "Row 1 - Cell 2" [, ...]],
            ["Row 2 - Cell 1", "Row 2 - Cell 2" [, ...]],
            [... more rows]
        ],
        // argument element is actually the instance itself ("this")
        function (element) {
            let headers = element.__$tag ('th'); // get a th collection

            if (!!headers.__toArray) { // true means it's a collection
                headers = headers.__toArray(); // convert to Array
                headers.forEach ((header) => {
                    header.css({
                        background : "#369",
                        color : "#fff",
                        cursor : "pointer"
                    })
                    .addEventListener(
                        "click",
                        function () {
                            alert(this.__text());
                        }
                    );
                });
            }
        }
    );
```

## Resources
- [Demo page](https://kotarow.github.io/MimicJS/mimicdemo.html)
- [Source code](https://kotarow.github.io/MimicJS/mimic.js)

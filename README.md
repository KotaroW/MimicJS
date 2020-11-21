# mimic.js - a public library

## About
At one night, I was tinkering a Javascript Date Object prototype to write a method called "calcAge()" which calculates the age given a date of birth (Date Object). Then I started writing more Object/Class methods for Object, HTMLElement and its sub classes, and so on. The purpose of this library (I hope I'm right to call it a library) is "less writing". For example, there might be a program which requires you to call *document.getElementsById()* so many times. I just wanted to simplify the method name like below:
```
document.__$id() // double-underscore
```
for document.getElementsByTagName is like:
```
document.__$tag()
```
I borrowed some ideas from JQuery. There are no reasons why I didn't create a separate scope but tweaked the prototypes. I'd like to see how it goes.


## Method Naming Convention
In an attempt to distinguish the methods from others, method names start with a double-underscore. I regard some of the methods as "special". They have a dollar-sign ($) after the double-underscore.

## Method lists
- Object
    - Object.__isStringNonObjectValuePair (arg1, arg2) : bool
    - Object.__isObjectArgument (arg) : bool
- HTMLDocument
    - document.__$id (string elementId) : HTMLElement|undefined => document.getElementById ()
    - document.__$query (string selector) : HTMLElement|undefined => document.querySelector ()
    - document.__$queryAll (string selector) : HTMLElementCollection => document.querySelectorAll ()
    - document.__$tag (string tagName) : HTMLElementCollection  => document.getElementsByTagName ()
    - document.__$class (string className) : HTMLElementCollection => document.getElementsByClassName ()
- HTMLElement (and its sub-classes)
    - htmlElementInstance.__$tag (string tagName, HTMLElement element) : HTMLElementCollection => htmlElement.getElementsByTagName ()
    - htmlElementInstance.__$class (string className, HTMLElement element) : HTMLElementCollection => htmlElement.getElementsByClassName ()
    - htmlElementInstance.__attr (varargs) : HTMLElement => (modified) htmlElement.setAttribute()
    - htmlElementInstance.__css (varargs) : HTMLElement => (modified) htmlElement.style.propertyName = propertyValue
    - htmlElementInstance.__text (string newText = undefined)  : HTMLElementCollection|string => (modified) htmlElement.textContent [= newText]
    - htmlElementInstance.__html (string newHTML = undefined) : HTMLElementCollection|string => (modified) htmlElement.innerHTML [ = newHTML]
- HTMLUListElement (this will be rewriten to accomodate other list types if feasible)
    - HTMLUListInstance.__populate (array listData, function callback = undefined) : HTMLUListElement
- HTMLTableElement
    - HTMLTableElementInstance.__populate (array tableHeaders, 2D-array tableData, function callback = undefined) : HTMLTableElement
    - HTMLTableInstance.__sort (HTMLTableCellElement (TH) headerElement, int columnIndex)
- HTMLInputElement
    - HTMLInputInstance.__val(newValue = undefiened) : string|HTMLInputElement 
- HTMLCollection
    - htmlCollectionInstance.__toArray (void) => uses Array.prototype.slice.call
- Array
    - Array.__range(int start, int end, int step = 1)
- Date
    - DateObjectInstance.__calcAge (void) : int
- String
    - string.__isNumber (void) : bool

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
- [Source code](https://kotarow.github.io/MimicJS/mimicdemo.html)

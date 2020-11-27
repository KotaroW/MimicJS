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
||Object.prototype.\_\_isStringNonObjectValuePair (mixed arg1, mixed arg2) : boolean|N/A - This is used to check the argment is a key/value pair.|
||Object.prototype.\_\_isObjectArgument (mixed arg1) : boolean|N/A|
|HTMLDocument / HTMLElement|||
||HTMLDocument.prototype.\_\_$id = function (string elementId) : HTMLElement|document.getElementById ()|
||HTMLDocument.prototype.\_\_$query = function (string selector) : HTMLElement|document.querySelector ()|
||HTMLDocument.prototype.\_\_$queryAll (string selector) : NodeList|document.querySelectorAll ()|
||HTMLDocument.prototype.\_\_$tag = HTMLElement.prototype.\_\_$tag = function (string tagName) : HTMLCollection|document.getElementsByTagName ()|
||HTMLDocument.prototype.\_\_$class = HTMLElement.prototype.\_\_$class = function (string className) : HTMLCollection|document.getElementsByClassName ()|
||HTMLDocument.prototype.\_\_appendChildren = HTMLElement.prototype.\_\_appendChildren = function (array\|HTMLElementCollection children)|N/A - Modified version of appendChild ()|
|HTMLElement|||
||HTMLElement.prototype.\_\_attr = function (...varargs) : HTMLElement| htmlElement.setAttribute () or JQuery.attr ()|
||HTMLElement.prototype.\_\_css (...varargs) : HTMLElement|JQuery.css()|
||HTMLElement.prototype.\_\_text (string newText=undefined)  : HTMLElement\|string|JQuery.text ()|
||HTMLElement.prototype.\_\_html (string newHTML=undefined) : HTMLElementC\|string|JQuery.html ()|
|HTML UL/OL istElement|||
||HTMLUListElement.prototype.\_\_populate = HTMLOListElement.prototype.\_\_populate = function (array listData, function callback=undefined) : HTMLUListElement|N/A - Polulate the list element. Callback can be used, for example. to style the list items.|
|HTMLTableElement|||
||HTMLTableElement.prototype.\_\_populate (array tableHeaders, array (2D) tableData, function callback=undefined) : HTMLTableElement|N/A - Populate the table element.|
||HTMLTableElement.prototype.\_\_sort (HTMLTableCellElement (TH) headerElement, int columnIndex) : void|NA - Sort table data by column|
|HTMLInputElement|||
||HTMLInputElement.prototype.\_\_val(newValue=undefiened) : string\|HTMLInputElement |JQuery.val ()|
|HTMLCollection|||
||HTMLCollection.prototype.\_\_toArray (void) : array|N/A (uses Array.prototype.slice.call)|
|Array||
||Array.\_\_proto__.\_\_range = function (int start, int end, int step = 1) : array | Python.range() - Object method|
|Date|
||Date.prototype.\_\_calcAge (void) : int|N/A|
||Date.prototype.\_\_numDays (void) : unsigned int|N/A - Instance method|
||Date.\_\_proto\_\_.numdays (unsigned int month, unsigned int year=undefined) : unsigned int|N/A - Object method|
|String|||
||String.prototype.\_\_isNumber (void) : bool|N/A - Checks if the string is a valid number|
||String.prototype.\_\_ucfirst (void) : string|N/A - Uppercase the first letter| 
|JSON|||
||JSON.\_\_proto__.\_\_get = async (@string url) : Promise|N/A - uses fetch () and Promise ()|

## Usage (Example)
```
// element section1
let section1 = document.__$query ("#section1");

// section header
let h2 = document.createElement ("h2").__text ("Table");

let p = document.createElement ("p")
    .__text ("This example build a HTML table. The table headers are clickable to sort the data. The sort method has been prototyped to HTMLTableElement.");

// append the two elements created above to the section
section1.__appendChildren ([h2, p]);

// get sample json data
let promise = JSON.__get ("users2.json");

// return value is Promise object
promise.then ((data) => {
    const headers = ["id", "name", "username", "email", "address", "phone", "website", "company"];
    const dataRows = [];

    data.forEach (item => {
        dataRows.push (Object.values (item));
    });

// create a table with the sample data
let table = document.createElement ("table")
    .__attr ("border", "1")
    .__css ("border-collapse", "collapse")
    .__populate (
        headers,
        dataRows,
        function (table) {
            let headers = table.__$tag ("th");

            // convert HTMLElementCollection to Array
            headers = headers.__toArray ();

            // style and append sort function to the header elements
            headers.forEach ((header, index) => {
                header.__text (header.__text ().__ucfirst ());
                header
                    .__css ({
                        background : "#369",
                        color : "#fff",
                        padding : "0.5rem 0.25rem",
                        fontWeight : "normal",
                        cursor : "pointer",
                        userSelect : "none"
                    })
                    .__attr ("title", "click to sort");

                    // add listener. As it involves an iteration, we need a callback (like).    
                    !function (tableElement, headerElement, index) {
                        headerElement.addEventListener (
                            "click",
                            function () {
                                table.__sort (header, index);
                            },
                            false
                        );
                    } (table, header, index);
             });

            // datarow styling
            var dataRows = table .__$tag ("tr").__toArray ();

            dataRows.forEach ((dataRow, index) => {
                // datarow style
                if (index != 0 && index % 2 == 0) {
                    dataRow.__css ("background", "#eee");
                }       

                // datacell style
                var dataCells = dataRow.__$tag ("td");
                dataCells = dataCells.__toArray ();
                    
                dataCells.forEach (dataCell => {
                    dataCell.__css ({
                        padding : "0.25rem 0.5rem" 
                    });
                });
            });
        }
    );

    // because it's a Promise
    section1.appendChild (table);               
});
```

## Resources
- [Demo page](https://kotarow.github.io/MimicJS/mimicdemo.html)
- [Source code](https://kotarow.github.io/MimicJS/mimic.js)

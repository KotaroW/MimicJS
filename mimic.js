/**********************************************************************
 * file         : mimic.js
 * written by   : KotaroW
 * date         : 20th November, 2020
 * description  :
 *     A JS Library
 **********************************************************************/


/********************
 * Object - to be inherited by derived objects
 ********************/

Object.prototype.__isStringNonObjectValuePair = function (arg1, arg2) {
    return (typeof arg1).toLowerCase() == "string" && (typeof arg2).toLowerCase() != "object";
};

Object.prototype.__isObjectArgument = function (arg) {
	return (typeof arg).toLowerCase() == "object";
};

/********************
 * HTMLDocument
 ********************/
/***
 * document.getElementById
 ***/
HTMLDocument.prototype.__$id = function (elementId) {
    return this.getElementById (elementId);   
};

/***
 * document.querySelector
 ***/
HTMLDocument.prototype.__$query = function (selector) {
    return this.querySelector (selector);
};

/***
 * document.querySelectorAll
 ***/
HTMLDocument.prototype.__$queryAll = function (selector) {
    return this.querySelectorAll (selector);
};

/***
 * document.getElementsByTagName
 * this method is shared by HTMLElement
 ***/
HTMLDocument.prototype.__$tag = function (tagName, element) {
    element = (element) ? element : this;
    
    return element.getElementsByTagName (tagName);
};

/***
 * document.getElementsByClassName
 * this method is shared by HTMLElement
 ***/
HTMLDocument.prototype.__$class = function (className, element) {
    element = (element) ? element : this;
    
    return element.getElementsByClassName (className);
};


/********************
 * HTMLElement (and its sub classes)
 * returns "this" to allow method call chaining
 ********************/

/***
 * shortcut for HTMLElements.getEelementsByTagName
 ***/
HTMLElement.prototype.__$tag = function (tagName) {
    return document.__$tag (tagName, this);
};

/***
 * shortcut for HTMLElements.getEelementsByTagName
 ***/
HTMLElement.prototype.__$class = function (className) {
    return document.__$class (className, this);
};

/***
 * set attribute(s)
 * argument pattern 1: (string property, non-object peropertyValue )
 * argument pattern 2: (object { property : propertyValue[, ...]})
 ***/
HTMLElement.prototype.__attr = function (...varargs) {

    // for argument pattern 1
	if (varargs.length > 1 && this.__isStringNonObjectValuePair (varargs[0], varargs[1])) {
    	this.setAttribute ([varargs[0]], varargs[1]);
    }
    // argument pattern 2
    else if (this.__isObjectArgument (varargs[0])) {
    	for (let key in varargs[0]) {
        	this.setAttribute(key, varargs[0][key]);
        }
    }
    return this;
};

/***
 * styling method
 * argument pattern 1: (string property, non-object peropertyValue )
 * argument pattern 2: (object { property : propertyValue[, ...]})
***/
HTMLElement.prototype.__css = function(...varargs) {

    // for argument pattern 1
	if (varargs.length > 1 && this.__isStringNonObjectValuePair(varargs[0], varargs[1])) {
    	this.style[varargs[0]] = varargs[1];
    }
    // argument pattern 2
    else if (this.__isObjectArgument(varargs[0])) {
    	for (let key in varargs[0]) {
        	this.style[key] = varargs[0][key];
        }
    }
    return this;
};

/***
 * text content getter/setter
 * the setter stores last content
 ***/
HTMLElement.prototype.__text = function(newText) {

    // if no arguments, return the current textContent
	if (newText == undefined) {
    	return this.textContent;
	}
    // otherwise it's an update. store the old content
    else {
    	this.oldTextContent = this.textContent;
    	this.textContent = arguments[0];
        return this;
    }
};

/***
 * inner html getter/setter
 * the setter stores last html content
 ***/
HTMLElement.prototype.__html = function(newHTML) {

    // if no arguments, return the current textContent
	if (newHTML == undefined) {
    	return this.innerHTML;
	}
    // otherwise it's an update. store the old content
    else {
    	this.oldInnerHTML = this.innerHTML;
    	this.innerHTML = arguments[0];
        return this;
    }
};

/***
 * populate a HTMLUListElement with list items
 * callback allows the caller to modify the HTMLUListElement and its LIElement
 ***/
HTMLUListElement.prototype.__populate = function (listData, callback) {
    if (!Array.isArray (listData)) {
        return this;
    }
    
    for (let index = 0; index < listData.length; index++) {
        let liElement = document.createElement ("li").__html(listData[index]);
        this.appendChild (liElement);
    }
    
    if (callback && (typeof callback).toLowerCase () == "function") {
        callback (this);
    }
    
    return this;
};

/***
 * populates HTMLTableElement
 * @param: tableHeaders -> Array (single dimention)
 * @param: tableData -> Array (two dimentional)
 * @param: callback -> function pointer
 ***/
HTMLTableElement.prototype.__populate = function (tableHeaders, tableData, callback) {
    let tbody = document.createElement ("tbody");
    let tr = null;
    
    // table header row
    if (Array.isArray (tableHeaders)) {
        tr = document.createElement ("tr");
        
        tableHeaders.forEach ((header) => {
            var th = document.createElement ("th").__html (header);
            tr.append (th);
        });
        
        tbody.appendChild (tr);
    }

    // table data row
    if (Array.isArray (tableData)) {
        tableData.forEach ((row) => {
           if (Array.isArray (row)) {
               tr = document.createElement ("tr");
               // table cells
               let cells = row.map ((celldata) => {
                   let cell = document.createElement ("td").__html(celldata);
                   return cell;
               });
               cells.forEach ((cell) => {
                    tr.appendChild (cell);
               });
               tbody.appendChild (tr);
           } 
        });
    }
    
    this.appendChild(tbody);
    
    if ((typeof callback).toLowerCase() == "function") {
        callback(this)
    }
    
    return this;
    
};

HTMLTableElement.prototype.__getColumnData = function (columnIndex) {
    let columnData = [];
    
    let datarows = this.__$tag ("tr");
    if (!!datarows.__toArray) {
        datarows = datarows.__toArray();
        // first row must be headers so discard it
        datarows.shift();
        
        datarows.forEach((datarow) => {
           columnData.push(datarow.__$tag ("td")[columnIndex].__text()); 
        });
        
    }
    
    return columnData;
    
}
/***
 * sort table given index by value
 * @param HTMLTableCellElement (th) headerElement
 * @param int columnIndex
 ***/
HTMLTableElement.prototype.__sort = function (headerElement, columnIndex) {
    // sort orders
    const ASCEND = "ascend";
    const DESCEND = "descend";
    
    const ARROW_UP = "&#8593";
    const ARROW_DOWN = "&#8595";
    
    const SORT_ARROW_CLASS_NAME = "__sortarrow";
    
    if (this.__sorColumnIndex == undefined || this.__sorColumnIndex != columnIndex) {
        this.__sortOrder = ASCEND;
    } else {
        this.__sortOrder = (this.__sortOrder == ASCEND) ? DESCEND : ASCEND;
    }
    
    this.__sorColumnIndex = columnIndex;

    let datarows = this.__$tag ("tr");
   
    if (!!datarows.__toArray) {
        datarows = datarows.__toArray ();
        // header row will be reused down there.
        let headerRow = datarows.shift ();
        
        // remove the previous arrow (sort order indicator) if exists
        let arrowClassElements = headerRow.__$class (SORT_ARROW_CLASS_NAME);
        if (arrowClassElements.length > 0) {
            let arrowElement = arrowClassElements[0];
            arrowElement.parentNode.removeChild (arrowElement);
        }
        
        
        for (let oIndex = 0; oIndex < datarows.length; oIndex++) {
            let candidateIndex = oIndex;
            for (let iIndex = oIndex + 1; iIndex <  datarows.length; iIndex++) {
                let candidateValue = datarows[candidateIndex].__$tag ("td")[columnIndex].__text();
                // for number comparison
                candidateValue = candidateValue.__isNumber () ? parseFloat (candidateValue) : candidateValue;
              
                let challengerValue = datarows[iIndex].__$tag ("td")[columnIndex].__text();
                // for number comparison
                challengerValue = challengerValue.__isNumber () ? parseFloat (challengerValue) : challengerValue;

                if (this.__sortOrder == ASCEND) {
                    if (challengerValue < candidateValue) {
                        candidateIndex = iIndex;
                    }
                }
                else {
                      if (challengerValue > candidateValue) {
                        candidateIndex = iIndex;
                    }              
                }
            }

            let tmpRow = datarows[oIndex];
            datarows[oIndex] = datarows[candidateIndex];
            datarows[candidateIndex] = tmpRow;
        }
        // update the table
        this.innerHTML = "";
        this.appendChild (headerRow);
        datarows.forEach ((datarow) => {
           this.appendChild (datarow); 
        });
        
        headerElement.__html (headerElement.__text () + ' <span class="' + SORT_ARROW_CLASS_NAME + '">' + (this.__sortOrder == ASCEND ? ARROW_DOWN : ARROW_UP) + "</span>");
    }
    
}


/********************
 * HTMLInputElement
 ********************/
HTMLInputElement.__val = function (newValue) {
    if (newValue != undefined) {
        return this.value;
    }
    else {
        this.oldValue = this.value;
        this.value =newValue;
        return this;
    }
};


/********************
 * HTMLCollection
 ********************/
/***
 * convert HTMLCollection Object to Array Object
 ***/
HTMLCollection.prototype.__toArray = function () {
    return Array.prototype.slice.call (this);
};


/********************
 * Array prototypes
 ********************/
/***
 * range generator
 * @param int start
 * @param int end
 * @param unsigned int by
 * "start" must be smaller than "end"
 * "by" will be Math.abs()-ed
 * the range does not include "end"
 ***/
Array.__range = function (start, end, by) {
    // coerce to integer
    start = parseInt(start);
    end = parseInt(end);
    
    if (by != undefined) {
        by = Math.abs(parseInt(by));
    }
    
    let arr = [];

    if (start < end) {
        // if by not supplied or 
        let skip = (by != undefined && by > 0) ? by : 1;
        // add 1 (one) to ensure the possible range is covered
        let numElements = parseInt(Math.abs(end - start) / skip) + 1;
    
        for (let index = 0, val = start; index < numElements && val < end; index++) {
            arr.push(val);
            val += skip;
        }
    }
    
    return arr;
};


/********************
 * Date
 ********************/
/***
 * calculate age as of today
 ***/
Date.prototype.calcAge = function () {
    // decompose two dates into year, month and date
    var dobComponents = getDateComponents(this);
    var todayComponents = getDateComponents(new Date());
    
    var age = todayComponents.year - dobComponents.year;
    
    // if today's month and date both must be greater than or equal to those of today
    // otherwise subtact one from  the age
    if ((todayComponents.month < dobComponents.month) || (todayComponents.month == dobComponents.month && todayComponents.date < dobComponents.date)) {
        --age;
    }
    
    return age;
    
    // function get year, month and day components from a date object
    // @param: dateobj -> object (Date)
    function getDateComponents(dateobj) {
        // argument must be a date object
        if (((typeof dateobj).toLowerCase() != "object") || dateobj.constructor.name != "Date") {
            return null;
        }

        // remember getMonth() returns the month index, starting zero
        var components = {year : dateobj.getFullYear(), month : dateobj.getMonth() + 1, date : dateobj.getDate() };

        return components;
    }    
};


/********************
 * String
 ********************/
/***
 * determines whether the string value is a valid number
 ***/
String.prototype.__isNumber = function () {

    return !isNaN (this);
    
};
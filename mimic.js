/**********************************************************************
 * file         : mimic.js
 * written by   : KotaroW
 * date         : 20th November, 2020
 * description  :
 *     A JS Library
 *     Format:
 *     / *@returnValueType* /
 *     MethodName (/ *@argumentType* / arg1 / *@=defaultValue * / [,/ *@argumentType* /...])
 **********************************************************************/


/********************
 * Object - to be inherited by derived objects
 ********************/

/*@boolean*/
Object.prototype.__isStringNonObjectValuePair = function (/*@mixed*/ arg1, /*@mixed*/ arg2) {
    return (typeof arg1).toLowerCase() == "string" && (typeof arg2).toLowerCase() != "object";
};

/*@boolean*/
Object.prototype.__isObjectArgument = function (/*@mixed*/ arg) {
	return (typeof arg).toLowerCase() == "object";
};



/********************
 * Window
 ********************/
/*@void*/
Window.prototype.__alert = function (/*@string*/ msgHTML) {
    let mask = document.createElement ("div").__css ({
        display : "flex",
        alignItems : "center",
        justifyContent : "center",
        position: "absolute",
        zIndex : 200,
        top : 0,
        bottom : 0,
        left : 0,
        right : 0,
        background: "#fff",
        opacity : 0.9
    });

    let alertBox = document.createElement ("div").__css ({
        border : "solid 1px #369",
        padding : "0.5rem 1rem",
        textAlign : "center",
        minWidth : "200px"
    });
    
    let msgElement = document.createElement ("p").__html (msgHTML);
    let okButton = document.createElement ("button").__text ("OK").__css({
        font : "inherit",
        appearance : "none",
        "-moz-appearance" : "none",
        color : "#fff",
        border: "solid 1px #ccc",
        borderRadius : "0",
        background: "#369",
        padding : "0.5rem 1rem",
        cursor : "pointer"
        
    });
    okButton.addEventListener(
        "click",
        function () {
            document.body.removeChild(this.parentNode.parentNode);
            document.body.__css ("overflow", "auto");
        },
        false
    )
    
    alertBox.appendChild (msgElement);
    alertBox.appendChild (okButton);
    mask.appendChild (alertBox);
    document.body.appendChild (mask);
    document.body.__css ("overflow", "hidden");
};



/****************************************
 * HTMLDocument
 ****************************************/

/**********
 * document.getElementById
 **********/
/*@HTMLElement|undefined*/
HTMLDocument.prototype.__$id = function (/*@string*/ elementId) {
    return this.getElementById (elementId);   
};

/**********
 * document.querySelector
 **********/
/*@HTMLElement|undefined*/
HTMLDocument.prototype.__$query = function (/*@string*/ selector) {
    return this.querySelector (selector);
};

/**********
 * document.querySelectorAll
 **********/
/*@HTMLElementCollection*/
HTMLDocument.prototype.__$queryAll = function (/*@string*/ selector) {
    return this.querySelectorAll (selector);
};

/**********
 * document|HTMLElement.getElementsByTagName
 **********/
/*@HTMLElementCollection*/
HTMLDocument.prototype.__$tag = HTMLElement.prototype.__$tag = function (/*@string*/ tagName) {
    
    return this.getElementsByTagName (tagName);

};

/**********
 * document|HTMLElement.getElementsByClassName
 **********/
/*@HTMLElementCollection*/
HTMLDocument.prototype.__$class = HTMLElement.prototype.__$class = function (/*@string*/ className) {
    
    return this.getElementsByClassName (className);

};

/**********
 * append multiple child elements at one go
 **********/
/*@Document|@HTMLElement*/
HTMLDocument.prototype.__appendChildren = HTMLElement.prototype.__appendChildren = function (/*@array|@HTMLElementCollection*/ children) {
        
    for (let index = 0; index < children.length; index++) {
        this.appendChild (children[index]);
    }
    
    return this;
}


/****************************************
 * HTMLElement (and its sub classes)
 * returns "this" to allow method call chaining
 ****************************************/

/**********
 * set attribute(s)
 * argument pattern 1: (string property, non-object peropertyValue )
 * argument pattern 2: (object { property : propertyValue[, ...]})
 ***********/
/*@HTMLElement*/
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

/**********
 * styling method
 * argument pattern 1: (string property, non-object peropertyValue )
 * argument pattern 2: (object { property : propertyValue[, ...]})
**********/
/*@HTMLElement*/
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

/**********
 * text content getter/setter
 * setter stores the previous content
 **********/
/*@HTMLElement*/
HTMLElement.prototype.__text = function(/*@string*/ newText /*@=undefined*/) {

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

/**********
 * inner html getter/setter
 * the setter stores last html content
 **********/
/*@HTMLElement*/
HTMLElement.prototype.__html = function(/*@string*/ newHTML /*@=undefined*/) {

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

/***********
 * populate a HTMLUListElement/HTMLOListElement with list items
 * callback allows the caller to modify the ListElement and its LIElement
 **********/
/*@HTMLUListElement|@HTMLOListElement*/
HTMLUListElement.prototype.__populate = HTMLOListElement.prototype.__populate = function (/*@string*/ listData, /*@function*/ callback /*@=undefined*/) {
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


/**********
 * populates HTMLTableElement
 **********/
/*@THMLTableElement*/
HTMLTableElement.prototype.__populate = function (/*@array*/ tableHeaders, /*@array (two demensional)*/ tableData, /*@function*/ callback /*@=undefined*/) {
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

/**********
 **********/
/*@array*/
HTMLTableElement.prototype.__getColumnData = function (/*@unsigned int*/ columnIndex) {
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

/**********
 * sort table given index by value
 **********/
/*@void*/
HTMLTableElement.prototype.__sort = function (/*HTMLTableCellElement (TH)*/ headerElement, /*@unsigned int*/ columnIndex) {
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



/****************************************
 * HTMLInputElement
 ****************************************/

/*@string|HTMLInputElement*/
HTMLInputElement.__val = function (/*@string*/ newValue /*@=undefined*/) {
    if (newValue != undefined) {
        return this.value;
    }
    else {
        this.oldValue = this.value;
        this.value =newValue;
        return this;
    }
};



/****************************************
 * HTMLCollection/NodeList
 ****************************************/
/**********
 * convert HTMLCollection/NodeList Object to Array Object
 **********/
/*@array(HTMLElement)*/
HTMLCollection.prototype.__toArray = NodeList.prototype.__toArray = function () {
    return Array.prototype.slice.call (this);
};



/****************************************
 * Array prototypes
 ****************************************/
/**********
 * range generator
 * "start" must be smaller than "end"
 * "by" will be Math.abs()-ed
 * the range does not include "end"
 **********/
/*@array (int)*/
Array.__range = function (/*@int*/ start, /*@int*/ end, /*@int*/ by) {
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



/****************************************
 * Date
 ****************************************/
/**********
 * calculate age as of today
 **********/
/*@unsigned int*/
Date.prototype.__calcAge = function () {
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

/**********
 * returns the number of days for the Date object
 *** (Notice) this is an instance method ***
 **********/
/*@int*/
Date.prototype.__numDays = function () {
	return Date.__numDays (this.getMonth () + 1, this.getFullYear ());
};

/**********
 * returns the number of days for the given month (and year)
 *** (Notice) this is an Object method ***
 **********/
/*@unsigned int|undefined*/
Date.__proto__.__numDays = function (/*@unsigned int*/ month, /*unsigned int*/ year) {

    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            if (year == undefined)
                return 28;
            return (((year % 4 == 0) && (year % 100 !=0)) || (year % 400)) ? 29 : 28;
        default:
            return undefined;
    }
};



/****************************************
 * String
 ****************************************/
/**********
 * determines whether the string value is a valid number
 **********/
/*@boolean*/
String.prototype.__isNumber = function () {

    return !isNaN (this);
    
};

/**********
 * Uppercase the first letter
 **********/
/*@string*/
String.prototype.__ucfirst = function () {

    return this.charAt (0).toUpperCase () + this.slice (1);
    
};


/****************************************
 * JSON Object
 ****************************************/
/**********
 * data getter
 ********/
/*@Promise*/
JSON.__proto__.__get = async (/*@string*/ url) => {
    const response = await fetch (url);

    if (response.ok) {
        try {
            const data = await response.json ();
            return Promise.resolve (data);
        }
        // status ok but no data or illegal data contents
        catch (err) {
            return Promise.reject (err);
        }
    }
    else {
        return Promise.reject (response);
    }
};

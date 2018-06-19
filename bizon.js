/*
 * Bizon.js v0.1
 * Copyright (c) 2018 Onur Kerimov
 * http://github.com/onurkerimov
 * Licensed under the MIT license
 * ---
 * This plugin uses Regular Expressions that are are taken from Satisfy.js, Copyright (c) James Padolsey
 * (most) Regular Expressions are Copyright (c) John Resig from the Sizzle Selector Engine. 
 */

window.$$ = (function() {

    var regex = {
        INDENT: /[^ \t]/,
        CHILD: / *\> */,
        ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?![^[\]]+])/g,
        TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/
    }

    function $$() {

        var arr = [],
            tempLiteral

        if (arguments.length === 1) {
            if (Array.isArray(arguments[0])) {
                var input = arguments[0]
            } else {
                var input = arguments[0].split(/\n/)
                tempLiteral = true
            }
        } else {
            var input = Array.from(arguments)
        }

        // First Step
        input.forEach((el) => {
            var _indent = el.match(regex.INDENT).index
            var obj = {}
            obj.indent = _indent
            obj.str = '%' + el.substring(_indent)
            arr.push(obj)
        })
        console.log("arr", arr);

        // Get indentation preference
        var i = 0
        var indents = arr.map(el => el.indent)
        indents.some((el) => {
            i++
            return el > 0
        })
        var divisor = indents[i]
        if (tempLiteral) {
            arr.map(el => el.indent -= divisor)
            arr[0].indent = 0
        } else {
            arr.map(el => el.indent /= divisor)
        }

        // Convert indentation to curly hierarchy
        var prevIndent, string = ''
        arr.forEach((el) => {
            if (el.indent === prevIndent) {
                string += '}'
            } else if (el.indent < prevIndent) {
                string += '}'.repeat(prevIndent - el.indent + 1);
            }
            string += el.str + '{';
            prevIndent = el.indent
        })
        if (0 === prevIndent) {
            string += '}';
        } else if (0 < prevIndent) {
            string += '}'.repeat(prevIndent + 1);
        }

        // Convert curly hierarchy to JSON string
        string = string
            .replace(/{}/g, ';')
            .replace(/{/g, '","ch":[')
            .replace(/}/g, ']}')
            .replace(/%/g, '{"$":"')
            .replace(/;/g, '"}') //.replace(/,]/g, ']')
            .replace(/}{/g, '},{')

        string = '{"$":"anan","ch":[' + string + ']}'
        console.log("string", string);

        var obj = JSON.parse(string)

        strToArray(obj)
        nestChildren(obj)
        return createNode(obj).children

    }

    function strToArray(obj) {
        var str = obj.$

        if (regex.CHILD.test(str)) {
            obj.$ = str.split(regex.CHILD)
        } else {
            obj.$ = [obj.$]
        }
        //Traverse
        if (obj.ch) {
            obj.ch.forEach((obj) => {
                strToArray(obj)
            })
        }
    }

    function nestChildren(obj) {
        var arr = obj.$

        if (arr.length === 1) {
            obj.$ = arr
        } else {
            while (arr.length !== 1) {
                if (obj.ch) {
                    obj.ch = [{
                        $: [arr.pop()],
                        ch: obj.ch
                    }]
                } else {
                    obj.ch = [{
                        $: [arr.pop()]
                    }]
                }
                obj.$ = arr
            }
        }
        //Traverse
        if (obj.ch) {
            obj.ch.forEach((obj) => {
                nestChildren(obj)
            })
        }
    }

    function createNode(obj) {
        var str = obj.$[0]
        var _tag_prep = str.match(regex.TAG)
        var _tag = _tag_prep ? _tag_prep[0] : 'div'
        var node = document.createElement(_tag)

        if (regex.ID.test(str)) {
            var _id = str.match(regex.ID)[1]
            node.id = _id
        }
        if (regex.CLASS.test(str)) {
            var _class = str.match(regex.CLASS)
            node.className = _class.join(' ').split('.').join('');
        }
        //Traverse
        if (obj.ch) {
            obj.ch.forEach((obj) => {
                node.appendChild(createNode(obj))
            })
        }
        return node
    }

    return $$
}());

var elem =
    $$(['#main-wrapper', //{html: '123', css: 'background: red;'}
        '  header > .search',
        '  #content-wrapper',
        '    main#content > article > p',
        '    aside#sidebar.right',
        '  footer'
    ])
console.dir(elem);

var elem = $$(`
#main-wrapper
	header > #search
	#content-wrapper
        main#content > article > p
        aside#sidebar.right
    footer > #contact
        .info `)

console.log(elem);


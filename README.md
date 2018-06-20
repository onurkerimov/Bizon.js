
# Bizon.js
**Bizon.js** is a client-side template engine. Its syntax is similar to HTML compilers such as Slim and Pug. Unlike those compilers, your code **can grow horizontally** by using *child selector* `>`, resulting in more dense code.

With **Bizon.js**, this input:
```js
$$(`#main-wrapper
        header > #search
        #content-wrapper
            main#content > article > p
            aside#sidebar.right
        footer > #contact
            .info`)
```
returns:
```html
<div id="main-wrapper">
    <header>
        <div class="search"></div>
    </header>
    <div id="content-wrapper">
        <main id="content">
            <article>
                <p></p>
            </article>
        </main>
            <aside id="sidebar" class="right"></div>
        </aside>
    </div>
    <footer>
        <div id="contact">
            <div class="info"></div>
        </div>
    </footer>
</div>
```
In the above example,   tab characters are used to represent indentation. Since some text editors automatically convert tab characters to multiple space characters (generally during beautification), the following use is safer:
```js
$$(['#main-wrapper',
    '  header > .search',
    '  #content-wrapper',
    '    main#content > article > p',
    '    aside#sidebar.right',
    '  footer > #contact',
    '    .info'])
```
## Specifications
This plugin takes one argument as the input. The argument can either be a **string**, or an **array of strings**. These cases are demonstrated in the first and the second examples, respectively. For the first, usage of tab characters as indentation is strictly advised. For the second, both space and tab characters can be used.

In the second example, 2 spaces represent 1 level of indentation, however, you can use as many spaces as you want, as long as the rest of the lines are consistent with your initial choice. This plugin automatically detects *'number of spaces used as 1 level indentation'* of your choice.

**Bizon.js**  returns a `HTMLCollection`.

## Proposal
I plan to implement the following functionality in the future:
```js
 $$(['#context-menu',
    '  ul > li', { id: ['cut', 'cpy', 'pst'], html: ['Cut', 'Copy', 'Paste'] },
    '  span#separator',
    '  ul > li', { repeat: 2, style: 'background: gray;' }
    '  span#separator',
    '  ul > li', { style: ['red', 'green', 'blue'].map(el => `background: ${el};`) }
])
```
Executes:
```html
<div id="context-menu">
    <ul>
        <li id="cut">Cut</li>
        <li id="cpy">Copy</li>
        <li id="pst">Paste</li>
    </ul>
    <span id="separator"></span>
    <ul>
        <li style="background: gray;"></li>
        <li style="background: gray;"></li>
    </ul>
    <span id="separator"></span>
    <ul>
        <li style="background: red;"></li>
        <li style="background: green;"></li>
        <li style="background: blue;"></li>
    </ul>
</div>
```

## License

Licensed under the MIT license.

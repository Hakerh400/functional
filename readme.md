**Functional()** is a turing-complete programming language based on the functional programming paradigm.

### Syntax

Source code is represented in the ascii charset and consists of characters `(`, `)`, `,`, whitespace characters and identifiers. Example:

```
abc(d(e, e1), f, g()),
h(&&(^), $(@, ~))(abc)
```

Everything that is not `(`, `)`, `,` or whitespace (that matches regular expression `\s+`) is considered as an identifier. Thus, the identifiers in the above example are `abc`, `d`, `e`, `e1`, `f`, `g`, `h`, `&&`, `^`, `$`, `@`, `~`.

Each program represents a *List* of zero or more *CallChains*. A *CallChain* is an identifier followed by zero or more *Lists* surrounded by a pair of parentheses. Elements of a *List* are separated by `,`.

The above example has two main *CallChains*: `abc(d(e, e1), f, g())` and `h(&&(^), $(@, ~))(abc)`. The first *CallChain* consists of identifier `abc` and *List* `(d(e, e1), f, g())`, while the second *CallChain* consists of identifier `h` and two *Lists*: `(&&(^), $(@, ~))` and `(abc)`.
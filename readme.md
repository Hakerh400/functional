**Functional()** is a turing-complete programming language based on the functional programming paradigm.

## Syntax

Source code is represented in the ascii encoding and consists of characters `(`, `)`, `,`, whitespace characters and identifiers. Example:

```
abc(d(e, e1), f, g()),
h(&&(^), $(@, ~))(abc)
```

Everything that is not `(`, `)`, `,` or whitespace (that matches regular expression `\s+`) is considered as an identifier. Thus, the identifiers in the above example are `abc`, `d`, `e`, `e1`, `f`, `g`, `h`, `&&`, `^`, `$`, `@`, `~`.

Each program represents a *List* of zero or more *CallChains*. A *CallChain* is an identifier followed by zero or more *Lists* surrounded by a pair of parentheses. Elements of a *List* are separated by `,`.

The above example has two main *CallChains*: `abc(d(e, e1), f, g())` and `h(&&(^), $(@, ~))(abc)`. The first *CallChain* consists of identifier `abc` and *List* `(d(e, e1), f, g())`, while the second *CallChain* consists of identifier `h` and two *Lists*: `(&&(^), $(@, ~))` and `(abc)`.

## Functions

Each identifier has a function associated with it. When program starts, the main *List* starts to evaluate.

*List* evaluates in the following way:

1. If the *List* is empty, return the function associated with the 0-th global identifier
2. Otherwise, evaluate all *List*'s *CallChains*

*CallChain* evaluates in the following way:

1. If the *CallChain* has no *Lists*, return the value of the *CallChain*'s identifier
2. Otherwise, do the following
    - 2.1. Evaluate all *CallChain*'s *Lists*
    - 2.2. Call the function associated with the first *List* as arguments
    - 2.3. Remove the first *List*
    - 2.4. Replace the identifier with the result of the call
    - 2.5. If the re are no more *List*, return the value of the identifier
    - 2.6. Otherwise, go to 2.2.
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

## Evaluation

Each identifier has a function associated with it. When program starts, the main *List* starts to evaluate.

*List* evaluates in the following way:

1. If the *List* is empty, return the function associated with the 0-th global identifier
2. Otherwise evaluate all *List*'s *CallChains*

*CallChain* evaluates in the following way:

1. If the *CallChain* has no *Lists*, return the value of the *CallChain*'s identifier
2. Otherwise do the following
    - 2.1. Evaluate all *CallChain*'s *Lists*
    - 2.2. Call the function associated with the first *List* as arguments
    - 2.3. Remove the first *List*
    - 2.4. Replace the identifier with the result of the call
    - 2.5. If there are no more *List*, return the value of the identifier
    - 2.6. Otherwise go to 2.2.

There are some exceptions to these rules.

## Functions

*Functional()* has 6 native functions. Native functions have no reserved identifiers, but their values are assigned to the first 6 identifiers (reading from left to right) that appear in the source code. If the source code has less identifiers that the number of native functions, some native functions will not be assigned to any identifier.

The native functions are:

1. Zero (0)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, returns the second one.

2. One (1)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, returns the first one.

3. Equality

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, returns 1 if they are the same, otherwise returns 0.

4. Assign

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, if the first one is not an identifier, returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise assigns the second argument to the identifier from the first argument.

5. Variable

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, if the first one is not an identifier, returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise creates a new variable in the most inner scope with name equals to the identifier<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; from the first argument and assigns the second argument to that variable.

6. New function

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes zero or more arguments, if any of the are not an identifier, returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise returns a *FunctionTemplate*.

*FunctionTemplate* is a function which has an internal list of formal arguments. When called, it doesn't evaluate it's arguments, but stores the argument list as its body and returns a new *UserlandFunction*.

*UserlandFunction* takes zero or more arguments, and evaluates them. Then each evaluated argument is assigned to the corresponding internal formal argument and the function body is evaluated in the new scope based on the formal and actual arguments.
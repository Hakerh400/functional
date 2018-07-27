**Functional()** is a turing-complete programming language based on the functional programming paradigm.

## Syntax

Source code is represented in the ASCII encoding and consists of characters `(`, `)`, `,`, whitespace characters and identifiers. Example:

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

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, if the first one is not an identifier returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise assigns the second argument to the identifier from the first argument.

5. Variable

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes two arguments, if the first one is not an identifier returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise creates a new variable in the most inner scope with name equals to the identifier<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; from the first argument and assigns the second argument to that variable.

6. New function

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes zero or more arguments, if any of the arguments is not an identifier returns 0,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise returns a *FunctionTemplate*.

*FunctionTemplate* is a function which has an internal list of formal arguments. When called, it doesn't evaluate it's arguments, but stores the argument list as its body and returns a new *UserlandFunction*.

*UserlandFunction* takes zero or more arguments and evaluates them. Then each evaluated argument is assigned to the corresponding internal formal argument and the function body is evaluated in the new scope based on the formal and actual arguments.

## IO interface

*Functional()* provides a way of adding native functions before running a program. This implementation provides 3 new functions for IO interface:

1. Read

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes no arguments, returns the next bit (0 or 1) from the input stream

2. Write

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes one argument, outputs the bit to the output stream and returns 0.

3. Eof

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Takes no arguments, returns 1 if there are no more bits in the input stream,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; otherwise returns 0.

These functions are assigned to the 7th, 8th and 9th identifier from the source code.

The function *Write* considers the 0th global identifier as bit 0 and anything other as bit 1. Both *Read* and *Write* process bits from input/output starting at the lowest bit of the first byte to the highest bit of the first byte, then the second byte, end so on. Calling *Read* after all input is read returns 0.

If the program is terminated, but the output has no enough bits to form a byte, the output will be padded with 0-bits in order to complete the byte.

# Examples

We assume the standard IO interface implementation is used. The first 9 identifiers that appear in the source code will be native functions. Accessing undefined identifier returns 0 (actually the 0th global identifier, which may be overriden though).

In these examples we will use identifiers `0`, `1`, `==`, `=`, `var`, `[]`, `read`, `write`, `eof` respectively. Note that there are nothing special about `==`, `=`, `[]`, they are valid identifiers.

### Example 1: Print letter "A"

```
0, 1,
==, =, var, [],
read, write, eof,

write(1), write(0), write(0), write(0),
write(0), write(0), write(1), write(0)
```

The ASCII code of letter "A" is 65, which is 1000001 in binary. Because the *Read* and *Write* functions process bits from lowest to highest, we need to reverse the bits. The last `write(0)` may be omitted because of padding incomplete bytes with 0-bits.

**Note:** In the following examples the header (first 9 identifiers) are omitted for simplicity, but they are required if you want to run the actual code.

### Example 2: Cat

```
var(not, [](a)(==(a, 0))),
var(bool, [](a)(not(not(a)))),

var(while, [](cond, func)(
  var(temp, bool(cond()))(while)(cond, func, temp(func)())
)),

while([]()(not(eof())), []()(
  write(read())
))
```

There are several things demontrated in this example.

Code `[](a)(==(a, 0))` creates an *UserlandFunction* that takes argument `a` and returns the result of comparison `a` with `0`. In other words, it returns `1` iff `a` is `0`, and `0` otherwise.

Code `var(not, [](a)(==(a, 0)))` assigns the newly created *UserlandFunction* to the global identifier `not`.

The similar thing does the second line: creates a function which takes argument `a` and returns `not(not(a))` (converts it to boolean).

Now, the interesting part: *while* loop. The *while* loop is just a function which takes two arguments: `cond` and `func`. While the result of calling `cond` returns a truthy value, call `func`. It is achieved by recursively calling `while` function. We will not describe here in details how and why this works.

It is possible to spin in a *while* loop forever, without causing a stack overflow. That is done by replacing caller's stack frame with the stack frame of the callee's last *CallChain*.

Finally, we call our `while` function with two *UserlandFunctions*. The first one returns `1` if `eof` returns `0`. The second one reads a bit from the input and writes the bit to the output. In other words: while `eof()` is false, read a bit and output it.
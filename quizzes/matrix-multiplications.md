---
title: Matrix Multiplications
slug: matrix-multiplications
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

If matrix $A$ has dimensions $3 \times 2$ and matrix $B$ has dimensions $2 \times 4$, what are the dimensions of the product $AB$?
- [x] $3 \times 4$
- [ ] $2 \times 2$
- [ ] $4 \times 3$
- [ ] Multiplication is not possible.

> The inner dimensions must match ($2$ and $2$). The resulting matrix takes the outer dimensions ($3$ and $4$).

Calculate the product:
$$
\begin{bmatrix} 1 & 2 \end{bmatrix} \times \begin{bmatrix} 3 \\ 4 \end{bmatrix}
$$
- [x] $[11]$
- [ ] $\begin{bmatrix} 3 & 8 \end{bmatrix}$
- [ ] $\begin{bmatrix} 3 \\ 8 \end{bmatrix}$
- [ ] $[7]$

> This is a dot product of a row and a column. $(1 \times 3) + (2 \times 4) = 3 + 8 = 11$.

Which of the following is generally true regarding matrix multiplication?
- [x] It is associative: $(AB)C = A(BC)$.
- [ ] It is commutative: $AB = BA$.
- [ ] It works for any two matrices regardless of size.

> Matrix multiplication is associative but generally **not** commutative ($AB \neq BA$ usually).

Multiply the Identity matrix $I$ by any compatible matrix $A$. What is the result?
- [x] $A$
- [ ] $I$
- [ ] $0$
- [ ] $A^2$

> The identity matrix acts like the number 1 in scalar multiplication. $AI = A$ and $IA = A$.

Given:
$$
A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, B = \begin{bmatrix} 2 & 3 \\ 4 & 5 \end{bmatrix}
$$
Calculate $AB$.
- [x] $\begin{bmatrix} 4 & 5 \\ 2 & 3 \end{bmatrix}$
- [ ] $\begin{bmatrix} 0 & 3 \\ 4 & 0 \end{bmatrix}$
- [ ] $\begin{bmatrix} 2 & 3 \\ 4 & 5 \end{bmatrix}$

> Matrix A is a permutation matrix; it swaps the rows of B.
> Row 1 of result: $0(2)+1(4)=4$, $0(3)+1(5)=5$.
> Row 2 of result: $1(2)+0(4)=2$, $1(3)+0(5)=3$.

For matrix multiplication $AB$ to be valid, the number of \_\_\_\_\_ in A must equal the number of \_\_\_\_\_ in B.
- [x] columns; rows
- [ ] rows; columns
- [ ] rows; rows
- [ ] columns; columns

> This is the dimension compatibility rule: $(m \times n) \times (n \times p)$.

What is the element at row 1, column 1 of the product of these matrices?
$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e & f \\ g & h \end{bmatrix}
$$
- [x] $ae + bg$
- [ ] $ae + bf$
- [ ] $af + bh$
- [ ] $ce + dg$

> Take Row 1 of the first matrix $[a, b]$ and dot it with Column 1 of the second matrix $[e, g]^T$. Result: $ae + bg$.
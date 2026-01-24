---
title: Matrix Transpositions
slug: matrix-transpositions
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

What is the transpose of the row vector $v = \begin{bmatrix} 1 & 2 & 3 \end{bmatrix}$?
- [x] $\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$
- [ ] $\begin{bmatrix} 3 & 2 & 1 \end{bmatrix}$
- [ ] $\begin{bmatrix} -1 & -2 & -3 \end{bmatrix}$

> Transposing switches rows and columns. A $1 \times 3$ row vector becomes a $3 \times 1$ column vector.

If $A_{ij}$ represents the element in row $i$ and column $j$ of matrix $A$, what is the element at $(i, j)$ of $A^T$?
- [x] $A_{ji}$
- [ ] $A_{ij}$
- [ ] $-A_{ji}$
- [ ] $1/A_{ij}$

> The formal definition of transpose is swapping indices $i$ and $j$.

What is the transpose of the product $(AB)^T$?
- [x] $B^T A^T$
- [ ] $A^T B^T$
- [ ] $A^T B$
- [ ] $AB^T$

> The "shoe-sock" property: when transposing a product, you must reverse the order of multiplication and transpose the individual matrices.

If a matrix $A$ is equal to its transpose ($A = A^T$), the matrix is called:
- [x] Symmetric
- [ ] Skew-symmetric
- [ ] Identity
- [ ] Inverse

> A symmetric matrix is mirror-imaged across its main diagonal.

Find $A^T$ if:
$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
$$
- [x] $\begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$
- [ ] $\begin{bmatrix} 4 & 3 \\ 2 & 1 \end{bmatrix}$
- [ ] $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$

> Row 1 ($1, 2$) becomes Column 1. Row 2 ($3, 4$) becomes Column 2.

What is $(A^T)^T$?
- [x] $A$
- [ ] $A^{-1}$
- [ ] $I$
- [ ] $A^2$

> Flipping the rows and columns twice returns the matrix to its original state.

Which of these matrices is its own transpose?
- [x] $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$
- [ ] $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$
- [ ] $\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$

> The Identity matrix and any diagonal matrix are symmetric.
> Option 1: Row 1 is [2 0], Col 1 is [2 0]. Row 2 is [0 2], Col 2 is [0 2]. They match.

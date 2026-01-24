---
title: Partial Derivatives
slug: partial-derivatives
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

What is the notation for the partial derivative of $f$ with respect to $x$?
- [x] $\frac{\partial f}{\partial x}$
- [ ] $\frac{df}{dx}$
- [ ] $f \cdot x$
- [ ] $\Delta f_x$

> We use the stylized "curly d" ($\partial$) to denote partial derivatives, distinguishing them from ordinary derivatives ($d$).

Given $f(x, y) = 3x^2y + 5y^3$, find $\frac{\partial f}{\partial x}$.
- [x] $6xy$
- [ ] $3x^2 + 15y^2$
- [ ] $6xy + 5y^3$
- [ ] $6x$

> Treat $y$ as a constant.
> The derivative of $3x^2y$ with respect to $x$ is $3y(2x) = 6xy$.
> The term $5y^3$ contains no $x$, so its derivative is 0.

Given $f(x, y) = 3x^2y + 5y^3$, find $\frac{\partial f}{\partial y}$.
- [x] $3x^2 + 15y^2$
- [ ] $6xy + 15y^2$
- [ ] $15y^2$
- [ ] $3x^2$

> Treat $x$ as a constant.
> The derivative of $3x^2y$ with respect to $y$ is $3x^2(1)$.
> The derivative of $5y^3$ is $15y^2$.

Compute the partial derivative $\frac{\partial}{\partial x}(x e^y)$.
- [x] $e^y$
- [ ] $x e^y$
- [ ] $e^x$
- [ ] $0$

> Since we derive with respect to $x$, $e^y$ is treated as a constant coefficient. The derivative of $x$ is 1.

If $f(x, y) = x^2 y^3$, what is the mixed partial derivative $f_{xy}$ (also written $\frac{\partial^2 f}{\partial y \partial x}$)?
- [x] $6xy^2$
- [ ] $6x^2y$
- [ ] $2x + 3y^2$
- [ ] $12xy$

> First find $f_x = 2xy^3$.
> Then differentiate that result with respect to $y$: $2x(3y^2) = 6xy^2$.

The vector composed of all first-order partial derivatives of a scalar function is called the:
- [x] Gradient
- [ ] Jacobian
- [ ] Hessian
- [ ] Determinant

> The gradient, denoted $\nabla f$, is the vector $[\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \dots]$.

Geometrically, what does $\frac{\partial f}{\partial x}$ represent at a point $(a,b)$ on the surface $z=f(x,y)$?
- [x] The slope of the tangent line in the $x$-direction.
- [ ] The height of the surface at that point.
- [ ] The volume under the surface.
- [ ] The curvature of the surface.

> It represents the rate of change of the function value as you move purely along the x-axis, holding y constant.
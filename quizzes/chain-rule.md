---
title: Chain Rule
slug: chain-rule
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

Given $y = f(u)$ and $u = g(x)$, what is the general formula for $\frac{dy}{dx}$ according to the Chain Rule?
- [x] $\frac{dy}{dx} = f'(u) \cdot g'(x)$
- [ ] $\frac{dy}{dx} = f'(x) \cdot g'(u)$
- [ ] $\frac{dy}{dx} = f'(u) + g'(x)$
- [ ] $\frac{dy}{dx} = f'(g(x))$

> The Chain Rule states that the derivative of a composite function is the derivative of the outer function evaluated at the inner function, multiplied by the derivative of the inner function.

Calculate the derivative of $h(x) = (3x + 1)^2$.
- [x] $6(3x + 1)$
- [ ] $2(3x + 1)$
- [ ] $6x + 1$
- [ ] $9x^2 + 1$

> Let $u = 3x+1$, so $h = u^2$.
> $\frac{dh}{du} = 2u$ and $\frac{du}{dx} = 3$.
> $\frac{dh}{dx} = 2(3x+1) \cdot 3 = 6(3x+1)$.

If $y = \sin(x^2)$, what is $\frac{dy}{dx}$?
- [x] $2x \cos(x^2)$
- [ ] $\cos(x^2)$
- [ ] $2x \sin(x^2)$
- [ ] $\cos(2x)$

> The outer function is $\sin(\cdot)$ and the inner function is $x^2$.
> Derivative of $\sin(u)$ is $\cos(u)$. Derivative of $x^2$ is $2x$.
> Result: $\cos(x^2) \cdot 2x$.

Find the derivative of $f(x) = e^{5x}$.
- [x] $5e^{5x}$
- [ ] $e^{5x}$
- [ ] $5xe^{5x-1}$
- [ ] $\frac{1}{5}e^{5x}$

> The derivative of $e^u$ is $e^u \cdot u'$. Here $u=5x$, so $u'=5$.

Differentiate $y = \ln(\cos x)$.
- [x] $-\tan x$
- [ ] $\frac{1}{\cos x}$
- [ ] $-\sin x$
- [ ] $\frac{1}{\sin x}$

> $\frac{dy}{dx} = \frac{1}{\cos x} \cdot \frac{d}{dx}(\cos x) = \frac{1}{\cos x} \cdot (-\sin x) = -\tan x$.

If $f(x) = \sqrt{1 + x^2}$, what is $f'(x)$?
- [x] $\frac{x}{\sqrt{1 + x^2}}$
- [ ] $\frac{1}{2\sqrt{1 + x^2}}$
- [ ] $\frac{2x}{\sqrt{1 + x^2}}$
- [ ] $x\sqrt{1+x^2}$

> Rewrite as $(1+x^2)^{1/2}$.
> Power rule: $\frac{1}{2}(1+x^2)^{-1/2}$. Chain: Multiply by $2x$.
> $\frac{1}{2}(1+x^2)^{-1/2} \cdot 2x = \frac{x}{\sqrt{1+x^2}}$.

In the function $h(x) = \sin(\cos(x))$, which is the "inner" function?
- [x] $\cos(x)$
- [ ] $\sin(x)$
- [ ] $x$

> The function applied first to $x$ is the inner function. Here, you calculate $\cos(x)$ before taking the sine of the result.
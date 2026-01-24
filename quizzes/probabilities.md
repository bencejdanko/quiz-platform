---
title: Probability Fundamentals
slug: probabilities
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

The probability of an event $P(A)$ must always satisfy:
- [x] $0 \leq P(A) \leq 1$
- [ ] $0 < P(A) < 1$
- [ ] $-1 \leq P(A) \leq 1$
- [ ] $P(A) \geq 1$

> Probabilities are defined as values between 0 (impossible) and 1 (certain).

If events $A$ and $B$ are independent, what is $P(A \text{ and } B)$?
- [x] $P(A) \times P(B)$
- [ ] $P(A) + P(B)$
- [ ] $P(A) / P(B)$
- [ ] $0$

> Independence implies that the occurrence of A has no effect on B. The joint probability is the product of the marginal probabilities.

You roll a standard 6-sided die. What is the probability of rolling a number greater than 4?
- [x] $1/3$
- [ ] $1/6$
- [ ] $1/2$
- [ ] $2/3$

> The numbers greater than 4 are 5 and 6. That is 2 outcomes.
> Total outcomes = 6.
> Probability = $2/6 = 1/3$.

If the probability of it raining tomorrow is $0.3$, what is the probability that it does **not** rain?
- [x] $0.7$
- [ ] $0.3$
- [ ] $-0.3$
- [ ] $0.0$

> The sum of probabilities for an event and its complement must equal 1. $1 - 0.3 = 0.7$.

Which term describes two events that cannot happen at the same time?
- [x] Mutually Exclusive
- [ ] Independent
- [ ] Conditional
- [ ] Correlated

> If $A$ happens, $B$ cannot. $P(A \cap B) = 0$.

What is the formula for Conditional Probability $P(A|B)$?
- [x] $\frac{P(A \cap B)}{P(B)}$
- [ ] $\frac{P(A)}{P(B)}$
- [ ] $P(A) \times P(B)$
- [ ] $P(A) - P(B)$

> $P(A|B)$ is the probability of A given B has occurred. It restricts the sample space to B.

A bag contains 3 Red balls and 2 Blue balls. You pick one, keep it, and pick another. Are these events independent?
- [x] No
- [ ] Yes

> This is sampling "without replacement." Removing the first ball changes the total number of balls and the ratio of colors for the second draw, so the probabilities change.

---
title: Neural Networks and Initialization
slug: neural-networks-initialization
authors: [bencejdanko]
tags: [DATA 255 Lecture 2]
---

In the context of Univariate Logistic Regression with one input layer and one output layer, which activation function $\sigma(z)$ is defined as $\frac{1}{1 + \exp(-z)}$?
- [x] Sigmoid
- [ ] ReLU
- [ ] Tanh
- [ ] Softmax

> The slides define the activation function for the output layer (first layer) as the Sigmoid function: $\sigma(z) = \frac{1}{1 + \exp(-z)}$.

According to the lecture slides, what distinguishes a "Shallow" Neural Network from a standard "Machine Learning" (Logistic Regression) model?
- [x] The presence of one hidden layer.
- [ ] The presence of more than two hidden layers.
- [ ] The use of a sigmoid activation function.
- [ ] The lack of an output layer.

> The slides define "Machine Learning" as having no hidden layer, a "(Shallow) Neural Network" as having one hidden layer, and a "Deep Neural Network" as having more than two hidden layers.

If a neural network has an input layer $a^{[0]}$, a hidden layer $a^{[1]}$, and an output layer $a^{[2]}$, which layer represents the final prediction?
- [x] The output layer $a^{[2]}$
- [ ] The hidden layer $a^{[1]}$
- [ ] The input layer $a^{[0]}$
- [ ] The bias unit $b^{[1]}$

> In the notation provided, the superscript denotes the layer number. The highest layer number (in this specific shallow network example) is the output layer.

In a Multivariate Logistic Regression model, if the output activation $a^{[1]} \geq 0.5$, what is the predicted class $\hat{y}$?
- [x] 1
- [ ] 0
- [ ] 0.5
- [ ] -1

> The decision boundary is set at 0.5. If the sigmoid output is greater than or equal to 0.5, the prediction is 1; otherwise, it is 0.

Consider a Shallow Neural Network with 3 input neurons ($n_x=3$) and 2 hidden neurons ($n_h=2$). According to the matrix form presented in the slides, what are the dimensions of the weight matrix $W^{[1]}$?
- [x] $[2, 4]$
- [ ] $[3, 2]$
- [ ] $[2, 3]$
- [ ] $[4, 2]$

> Slide 10 specifies the dimension as $[n_h, n_x + 1]$ to account for the bias term included in the matrix multiplication. With $n_h=2$ and inputs=3, the dimension is $[2, 3+1] = [2, 4]$.

Following the previous question (3 inputs, 2 hidden neurons), if the output layer has 1 neuron ($n_o=1$), what are the dimensions of the weight matrix $W^{[2]}$?
- [x] $[1, 3]$
- [ ] $[1, 2]$
- [ ] $[2, 1]$
- [ ] $[3, 1]$

> Slide 11 specifies the dimension as $[n_o, n_h + 1]$. Here, $n_o=1$ and $n_h=2$. Therefore, the dimension is $[1, 2+1] = [1, 3]$.

Why is it recommended to initialize weights randomly rather than setting them all to zero?
- [x] To break symmetry so neurons compute different features.
- [ ] To ensure the weights sum to one.
- [ ] To prevent the gradients from becoming too large (exploding gradients).
- [ ] Zero initialization causes the computer to divide by zero.

> If weights are initialized to zero, every neuron in the hidden layer performs the exact same computation and updates identically during gradient descent. Random initialization breaks this symmetry.

Which Python/Numpy command is suggested in the slides to initialize weights with small random numbers from a Gaussian distribution?
- [x] `W = 0.01 * np.random.randn(D, H)`
- [ ] `W = np.zeros((D, H))`
- [ ] `W = np.random.rand(D, H)`
- [ ] `W = np.ones((D, H))`

> The slides recommend `np.random.randn(D,H)` (which generates samples from a standard normal distribution) multiplied by a small scalar (0.01).

What is the primary purpose of setting a random seed (e.g., `torch.manual_seed(seed)`) in neural network training?
- [x] To ensure reproducibility and determinism for debugging.
- [ ] To make the training faster.
- [ ] To automatically optimize the learning rate.
- [ ] To prevent the model from overfitting.

> Setting the seed ensures that the "random" numbers generated for initialization, dropout, etc., are the same every time you run the code, allowing you to reproduce results and hunt down bugs.

In the context of the slides, when is a hidden layer particularly useful?
- [x] When there is no direct or strong correlation between the input layer and the output layer.
- [ ] When the dataset is very small.
- [ ] When you want to use a linear activation function.
- [ ] When you want to reduce the computational cost.

> Slide 5 states that a hidden layer works well "if there is no direct (or strong) correlation between input layer and output layer," implying it captures non-linear or complex relationships.
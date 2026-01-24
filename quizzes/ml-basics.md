---
title: Machine Learning Basics
slug: ml-basics
authors: [bencejdanko]
tags: [DATA 255 Lecture 1]
---

In Supervised Learning, the dataset consists of:
- [x] Input features and corresponding output labels
- [ ] Only input features
- [ ] Only output labels
- [ ] Unstructured data with no goals

> Supervised learning requires "ground truth" labels (targets) to train the model to map inputs to outputs.

Which of the following is a Classification problem?
- [x] Predicting if an email is "Spam" or "Not Spam"
- [ ] Predicting the price of a house
- [ ] Predicting the temperature for tomorrow
- [ ] Grouping customers by purchasing habits (without predefined groups)

> Classification predicts discrete categories/classes. The others are Regression (price, temp) or Clustering (grouping).

What phenomenon occurs when a model learns the training data too well, including the noise, and performs poorly on new data?
- [x] Overfitting
- [ ] Underfitting
- [ ] Regularization
- [ ] Bias

> Overfitting is like memorizing the answers to a practice test but failing the real exam because you didn't learn the concepts.

What is the purpose of a "Test Set"?
- [x] To evaluate the final performance of the model on unseen data
- [ ] To train the model parameters
- [ ] To tune hyperparameters
- [ ] To increase the size of the training data

> The test set acts as a proxy for real-world data to ensure the model generalizes well. It is never used for training.

In the context of neural networks, what is a "Loss Function"?
- [x] A mathematical way to measure how far the model's predictions are from the actual targets
- [ ] A function that deletes data
- [ ] The accuracy of the model expressed as a percentage
- [ ] An algorithm for sorting data

> The loss function (or cost function) quantifies the error. The goal of training is to minimize this value.

Which of these is a Hyperparameter?
- [x] The Learning Rate
- [ ] The weights inside the neuron
- [ ] The bias term inside the neuron
- [ ] The predicted output value

> Hyperparameters are settings chosen *before* training begins (like learning rate, number of layers). Weights and biases are parameters learned *during* training.

What is Gradient Descent?
- [x] An optimization algorithm used to minimize the loss function
- [ ] A method for visualizing data
- [ ] A type of neural network layer
- [ ] A technique for data cleaning

> Gradient Descent iteratively adjusts parameters by moving in the opposite direction of the gradient (the slope) to find the minimum error.
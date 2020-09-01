from django.shortcuts import render
from django.http import HttpResponse
import nltk
from nltk.stem.lancaster import LancasterStemmer
import numpy
import os
import tflearn
import tensorflow
import random
import json
import pickle
# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
stemmer = LancasterStemmer()
filePath = os.path.join(path, "CovidBot/data.json")
filePath2 = os.path.join(path, 'CovidBot/model.tflearn')
with open(filePath, encoding='utf-8') as file:
    data = json.load(file)
with open("data.pickle", "rb") as f:
    words, labels, training, output = pickle.load(f)

tensorflow.reset_default_graph()

net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)

model.load(filePath2)


def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return numpy.array(bag)


def chat(inp):
    # print("Start talking with the bot (type quit to stop)!")
    # while True:
    #     inp = input("You: ")
    #     if inp.lower() == "quit":
    #         break
    results = model.predict([bag_of_words(inp, words)])
    results_index = numpy.argmax(results)
    tag = labels[results_index]

    for tg in data["intents"]:
        if tg['tag'] == tag:
            responses = tg['responses']

    # print(random.choice(responses))
    return random.choice(responses)


def index(request):
    return render(request, 'index.html')


@api_view(['GET', 'POST'])
def chatResponse(request):
    if request.method == 'POST':
        data = request.data
        response = chat(data['message'])
        return Response(status=status.HTTP_200_OK, data={"data": response})
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

import nltk
from nltk.stem import WordNetLemmatizer
lemma = WordNetLemmatizer()
import json
import pickle

import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import random

words=[]
classes = []
docs = []
ignore_words = ['?', '!','',"'"]
data_file = open('Healthdata.json').read()
intents = json.loads(data_file)


for i in intents['intents']:
    for pattern in i['patterns']:

        w = nltk.word_tokenize(pattern)
        words.extend(w)
        
        docs.append((w, i['tag']))

        
        if i['tag'] not in classes:
            classes.append(i['tag'])


words = [lemma.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))

classes = sorted(list(set(classes)))

print (len(docs), "documents")

print (len(classes), "classes", classes)

print (len(words), "unique lemmatized words", words)


pickle.dump(words,open('word.pkl','wb'))
pickle.dump(classes,open('class.pkl','wb'))


training = []

output_empty = [0] * len(classes)

for d in docs:
  
    bag = []
   
    pattern_words = d[0]
   
    pattern_words = [lemma.lemmatize(word.lower()) for word in pattern_words]
    
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
    
  
    output_row = list(output_empty)
    output_row[classes.index(d[1])] = 1
    
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training,dtype=object)

x_train = list(training[:,0])
y_train = list(training[:,1])
print("created Training data Succesfully")


#make changes from here
model = Sequential()
model.add(Dense(150, input_shape=(len(x_train[0]),), activation='relu'))
model.add(Dropout(0.1))
model.add(Dense(150, activation='relu'))
model.add(Dropout(0.1))
model.add(Dense(len(y_train[0]), activation='softmax'))


sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])


file = model.fit(np.array(x_train), np.array(y_train), epochs=200, batch_size=5, verbose=1)
model.save('model.h5', file)

print("Successful model creation")

loss, accuracy = model.evaluate(np.array(x_train), np.array(y_train))
print('Accuracy:', accuracy)
print('Loss:',loss)
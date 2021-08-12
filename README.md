# eXSTS: eXplainable Semantic Textual Similarity
In this paper, the concrete problem we are solving is the job advertisement classification tasks. 
eXSTS will receive a job advertisement, and retrieve the top 5 relevant National Occupational Classification(NOC) groups and STS scores for each NOC group.
The front-end user interface will demonstrate the hidden STS relationship between this job advertisement and one NOC group in the top 5 relevant NOC group to
1. let other field domain experts who may or may not have an IT knowledge background believe the correctness of the retrieved top 5 NOC group
2. provide new insights of the detailed STS relationship across two documents.

## Required library
The code is written in Python 3.8 and requires the following primary packages.
```
Tensorflow >= 2.4
PyTorch >= 1.6
transformers >= v4.6.0
Numpy
sentence-transformers
```

Please following the instruction to install the required libraries.
Tensorflow: https://www.tensorflow.org/install
sentence-transformers (include PyTorch): https://www.sbert.net/docs/installation.html#

I strong recommend to create a virtual environment and install all the libraries to run eXSTS.

## Dataset
NOC dataset come from the Government of Canada National Occupational Classification website: https://noc.esdc.gc.ca/
In this project, 500 NOC group have been extract from the website and saved as JSON files in the folder (/static/data/NOC)

JOB advertisement dataset come from LinkedIn and Indeed. You can find the JSON file of JOB advertisement in the folder (/static/data/JOB)

the TOP5 folder (/static/data/TOP%) include the ranking list of 500 NOC groups for each job advertisement. The score represent the similarity score between job advertisment and current NOC group.

## Run eXSTS
If you are using virtual environment, please open the virtual environment. For example
```
source exstsVenv/bin/activate
```

If you are run eXSTS in your local machine, you can use the app.run() in setup.py at line 157
If you are run eXSTS in the cloud, you may need to modify the port and host information in setup.py.

In order to run the server, you need to run the setup.py.
```
python eXSTS/setup.py
```

When the server is running, you can click the link to access the fonr-end user interface of eXSTS

## Demo

# eXSTS: eXplainable Semantic Textual Similarity
In this paper, the concrete problem we are solving is the job advertisement classification tasks. 
eXSTS will receive a job advertisement and retrieve the top 5 relevant National Occupational Classification(NOC) groups and STS scores for each NOC group.
The front-end user interface will demonstrate the hidden STS relationship between this job advertisement and one NOC group in the top 5 relevant NOC groups.

The visualization in eXSTS could 
1. let other field domain experts who may or may not have an IT knowledge background explore the correctness of the retrieved top 5 NOC group
2. provide new insights into the detailed STS relationship across two documents.

## Application Scenarios
eXSTS can help the Government of Canada to solve the following problems:
1. According to the top5 NOC group list, eXSTS can identify new job advertisements which not belong to any NOC group.
2. According to the visualizations, eXSTS can help Government to improve the NOC group system.
    1. How to rewrite the existing NOC group to cover the new job advertisement?
    2. How to improve the early draft of the new NOC group? Which paragraph is good enough, and which paragraph needs improving.

## Required library
The code is written in Python 3.8 and requires the following primary packages. I strongly recommend creating a virtual environment and install all the libraries to run eXSTS.
```
Tensorflow >= 2.4
PyTorch >= 1.6
transformers >= v4.6.0
NumPy
sentence-transformers
```

Please following the instruction to install the required libraries.<br />
Tensorflow: https://www.tensorflow.org/install<br />
sentence-transformers (include PyTorch): https://www.sbert.net/docs/installation.html#

## Dataset
NOC dataset comes from the Government of Canada National Occupational Classification website: https://noc.esdc.gc.ca/<br />
In this project, 500 NOC groups have been extracted from the website and saved as JSON files in the folder (/static/data/NOC)

JOB advertisement dataset comes from LinkedIn and Indeed. You can find the JSON files of the JOB advertisement in the folder (/static/data/JOB)

The TOP5 folder (/static/data/TOP5) includes the ranking list of 500 NOC groups for each job advertisement. The score represents the similarity score between the job advertisement and the NOC group.

## Run eXSTS
If you are using a virtual environment, please open the virtual environment. For example
```
source YOUR_VENV_FOLDER_NAME/bin/activate
```

If you are run eXSTS in your local machine, you can use the app.run() in setup.py at line 157.<br />
If you are run eXSTS in the cloud, you may need to modify the port and host information in setup.py.

In order to run the server, you need to run the setup.py.
```
python eXSTS/setup.py
```

When the server is running, you can click the link in the console to access the front-end user interface of eXSTS.

## Demo

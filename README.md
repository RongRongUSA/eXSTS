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
### The front-end UI with relationship visualization
The front-end user interface consists of four parts, the top 5 NOC group list, job advertisement \& NOC group content display, relationship visualization \& Matrix visualization, and the drop-down list. The user can click the button to switch between two visualizations.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/overall_curve.png)

### The front-end UI with matrix visualization
The console of matrix visualization in the front-end user interface includes two extra buttons to switch between the entirety and locality of matrix visualization
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/overall_matrix.png)

### The top 5 NOC group list
After the system received a job advertisement,eXSTS will retrieve the top 5 relevant NOC groups and the STS score of each NOC group.The user can click one of the NOC groups in the top 5 NOC group list to investigate and interrogate the comparison between a job advertisement and the selected NOC group by two visualizations.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/top5.png)

### The drop-down list
The drop-down list in the function bar includes several popular NOC groups in the IT field that the Government of Canada mentioned on the official website. The user can select their familiar IT field and provide suggestions in the user study's evaluation phase. We will use the demo option to introduce our UI in the user study's training phase.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/dropdown.png)

### Job advertisement & NOC group content display
The content display is designed to read the text and observe the sentence position in the document. The sentence abbreviation in two visualizations will be feed into here to present content. The selected sentence will be highlighted in the job advertisement or the NOC group, and the tool-tip will display the sentence abbreviation.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/job_contents.png)

### The Many-to-Many relationship visualization with console
There are two range sliders in the console. The value of the first range slider ( "Key sentence threshold" ) is the threshold to control the number of important sentences on the left of the relationship visualization. The second range slider ( "Top $X$ relevant sentence" ) will determine how many relevant sentences in the NOC group will be displayed in the One-to-Many relationship.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/curve_all.png)

### The One-to-Many relationship visualization with console
The user can click the sentence abbreviation (e.g., JOB\_39) to observe the One-to-Many relationship of JOB\_39. The tool-tip will display the content and STS score of two sentences.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/curve_all_one2many.png)

### The entirety of matrix visualization with console
The entirety of matrix visualization will demonstrate all the sentence pairs across two documents. The tool-tip will display the content and STS score of the selected sentence pair.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/matrix_all.png)

### The locality of matrix visualization with console
The locality of matrix visualization will demonstrate a specific area in the entirety of Matrix visualization. Two range sliders will control the start of the vertical axis and horizontal axis in the locality of matrix visualization, and the tool-tip will display the content and STS score of the selected sentence pair.
![alttext](https://github.com/RongRongUSA/eXSTS/blob/main/figure/matrix_local_all.png)

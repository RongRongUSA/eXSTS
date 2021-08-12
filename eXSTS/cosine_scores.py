import json
import os
import pickle
from os import path
from flask import jsonify

import tensorflow as tf
import numpy as np
import collections
from sentence_transformers import SentenceTransformer, util

JOB_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/JOB/'
NOC_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/NOC/'
TOP5_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/TOP5/'


def extract_duty_description(dutyList):
    sentences = []

    for ele in dutyList:
        if type(ele) == dict:
            for key in ele.keys():
                sentences = data_add_into_list(sentences, ele[key])
        elif type(ele) == str:
            sentences.append(ele)

    return sentences


def data_add_into_list(dataList, testData):
    if testData is None or len(testData) == 0:
        return dataList
    elif type(testData) == str:
        dataList.append(testData)
    elif type(testData) == list:
        if type(testData[0]) == str:
            dataList = dataList + testData
        else:
            raise Exception("read json file error, when testData != str in list")
    else:
        raise Exception("read json file error")

    return dataList


def NOC_json_to_list(URL):
    with open(URL, 'rb') as f:
        json_NOC_data = json.load(f)

    NOC_sentences = []

    for key in json_NOC_data.keys():
        if key == "main duties":
            NOC_sentences.append("main duties")
            NOC_sentences = NOC_sentences + extract_duty_description(json_NOC_data[key])
        elif key == "exclusions" or key == "id":
            continue
        else:
            if key != "name":
                NOC_sentences.append(key)
            NOC_sentences = data_add_into_list(NOC_sentences, json_NOC_data[key])

    return NOC_sentences


def job_json_to_list(URL):
    with open(URL, 'rb') as f:
        json_194_data = json.load(f)

    Job_Ads_sentences = []

    for row in json_194_data:
        for key in row.keys():
            if type(row[key]) == str:
                Job_Ads_sentences.append(row[key])
            else:
                Job_Ads_sentences = Job_Ads_sentences + row[key]

    return Job_Ads_sentences

def get_cosine_scores_list(sentences1, sentences2):
    model = SentenceTransformer('paraphrase-distilroberta-base-v1')
    embeddings1 = model.encode(sentences1, convert_to_tensor=True)
    embeddings2 = model.encode(sentences2, convert_to_tensor=True)

    # Compute cosine-similarits
    cosine_scores = util.pytorch_cos_sim(embeddings1, embeddings2)

    return cosine_scores


def get_top5_list(jobIndex):
    JOB_FILE_URL = JOB_FOLDER_URL + jobIndex
    if path.exists(JOB_FILE_URL):
        job_list = job_json_to_list(JOB_FILE_URL)

        nocFiles = os.listdir(NOC_FOLDER_URL)
        # nocFiles = ["9222.json", "2173.json", "2283.json", "2141.json", "0211.json"]

        similarityScoreList = {}
        for nocFile in nocFiles:
            print(nocFile)
            NOC_FILE_URL = NOC_FOLDER_URL + nocFile
            if path.exists(NOC_FILE_URL):
                NOC_list = NOC_json_to_list(NOC_FILE_URL)
            else:
                print("noc json file is not exist.")
                return 0

            cosine_scores_list = get_cosine_scores_list(job_list, NOC_list)
            similarityScoreList[nocFile] = (tf.math.reduce_mean(cosine_scores_list)).numpy().item()
            # similarityScoreList[nocFile] = (documentSimilarityScore(cosine_scores_list)).numpy().item()

        return dict(sorted(similarityScoreList.items(), key=lambda item: item[1], reverse=True))
    else:
        print("job json file is not exist.")
        return 0


def documentSimilarityScore(cosine_scores_list):
    # 2d array to sorted 1d array
    sorted_list = tf.sort(tf.reshape(cosine_scores_list, [-1]))

    # remove all negative value
    sorted_list = sorted_list[sorted_list > 0]

    average = 0
    interval = 0.0001
    for i in np.arange(0.0, 1.0, interval):
        # print(i)
        temp = sorted_list[i < sorted_list]
        temp = temp[temp <= (i + interval)]
        if len(temp) != 0:
            average += len(temp) * tf.math.reduce_mean(temp) * i * 10000
        # break

    # print(tf.math.reduce_mean(sorted_list))
    return average / len(sorted_list)


if __name__ == '__main__':
    print("JOB_FOLDER_URL = " + str(path.exists(JOB_FOLDER_URL)))
    print("NOC_FOLDER_URL = " + str(path.exists(NOC_FOLDER_URL)))

    # print(json.dumps(top5List))

    jobFiles = os.listdir(JOB_FOLDER_URL)

    for jobFile in jobFiles:
        print(jobFile)
        top5List = get_top5_list(jobFile)
        temp = jobFile.split(".")
        jobTop5Name = temp[0] + '_TOP5.' + temp[1]
        with open(TOP5_FOLDER_URL + jobTop5Name, 'w') as outfile:
            json.dump(top5List, outfile)

        print("\n\n\n")

    # --- old ---
    # print("DATA_FOLDER_URL = " + str(path.exists(DATA_FOLDER_URL)))
    # print("JOB_ADS_URL = " + str(path.exists(JOB_ADS_URL)))
    # print("NOC_URL = " + str(path.exists(NOC_URL)))
    #
    # job_list = job_json_to_list(JOB_ADS_URL)
    # NOC_list = NOC_json_to_list(NOC_URL)
    # cosine_scores_list = get_cosine_scores_list(job_list, NOC_list)
    # print(len(cosine_scores_list))
    # print(len(cosine_scores_list[0]))

import json
import pathlib
import os

from flask import Flask, render_template
from flask import request, jsonify
from flask_cors import CORS, cross_origin

from cosine_scores import NOC_json_to_list, job_json_to_list, get_cosine_scores_list

app = Flask(__name__)
cors = CORS(app)

JOB_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/JOB/'
NOC_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/NOC/'
TOP5_FOLDER_URL = '/users/grad/jiarong/eXSTS/eXSTS/static/data/TOP5/'


@app.route('/')
def consent():
    return render_template('consent.html')

@app.route('/eXSTS')
def eXSTS():
    return render_template('index.html')


# Read job ads json file and send it to front-end
@app.route('/jobAdsJsonFile', methods=['GET'])
@cross_origin()
def getJobAdsData():
    if request.args.get('job'):
        jobPath = JOB_FOLDER_URL + request.args.get('job') + '.json'
        file = pathlib.Path(jobPath)
        if file.exists():
            with open(jobPath, 'rb') as outfile:
                return jsonify(json.load(outfile))
        else:
            return f"Job ads data '{jobPath}' not found!", 400
    else:
        return f"job parameter not received", 400


# Read NOC json file and send it to front-end
@app.route('/NOCJsonFile', methods=['GET'])
@cross_origin()
def getNOCData():
    if request.args.get('noc'):

        NOCPath = NOC_FOLDER_URL + request.args.get('noc') + '.json'

        file = pathlib.Path(NOCPath)
        if file.exists():
            with open(NOCPath, 'rb') as outfile:
                return jsonify(json.load(outfile))
        else:
            return f"Job ads data '{NOCPath}' not found!", 400
    else:
        return f"noc parameter not received", 400


# compare two document and return cosine score between each sentences
@app.route('/CosineScore', methods=['GET'])
@cross_origin()
def getCosineScoreData():
    if request.args.get('job') and request.args.get('noc'):
        # set job ads URL and NOC URL
        JOB_ADS_URL = JOB_FOLDER_URL + request.args.get('job') + '.json'
        NOC_URL = NOC_FOLDER_URL + request.args.get('noc') + '.json'

        # read job ads json and spilt document to sentences and add into list
        job_list = pathlib.Path(JOB_ADS_URL)
        if job_list.exists():
            job_list = job_json_to_list(JOB_ADS_URL)
        else:
            return f"Job ads data '{path}' not found!", 400

        # read NOC json file and spilt document to sentences and add into list
        NOC_list = pathlib.Path(NOC_URL)
        if NOC_list.exists():
            NOC_list = NOC_json_to_list(NOC_URL)
        else:
            return f"NOC data '{path}' not found!", 400

        # calculate each sentence pairs' cosine scores
        cosine_scores_list = get_cosine_scores_list(job_list, NOC_list)

        return jsonify(job_ads=job_list,
                       NOC=NOC_list,
                       cosine=cosine_scores_list.tolist())
    else:
        return f"job or noc parameter not received", 400


# Read NOC json file and send it to front-end
@app.route('/List', methods=['GET'])
@cross_origin()
def getListData():
    if request.args.get('job'):

        return request.args.get('job')
    else:
        return f"job parameter not received", 400


# Read NOC json file and send it to front-end
@app.route('/Top5List', methods=['GET'])
@cross_origin()
def getTop5ListData():
    if request.args.get('job'):
        jobPath = TOP5_FOLDER_URL + request.args.get('job') + '_TOP5.json'
        file = pathlib.Path(jobPath)
        if file.exists():
            with open(jobPath, 'rb') as outfile:
                data=outfile.read()
            
            data = json.loads(data)
            nameIndexs = sorted(data, key=data.get, reverse=True)[:5]

            names = []
            score = []
            for name in nameIndexs:
                score.append(str(round(data[name], 2)) + '%')

                NOC_URL = NOC_FOLDER_URL + name
                NOC_list = pathlib.Path(NOC_URL)
                if NOC_list.exists():
                    with open(NOC_URL, 'rb') as f:
                        json_NOC_data = json.load(f)
                    names.append((name.split("."))[0] + ' - ' + json_NOC_data['name'])
                else:
                    f"noc data '{NOC_URL}' not found!", 400
            
            return jsonify({"name": names, "score": score})
            # return jsonify({"name": names, "score": ["9.58%", "7.68%", "5.78%", "4.56%", "3.27%"]})
        else:
            return f"Job ads data '{jobPath}' not found!", 400
    else:
        return f"job parameter not received", 400


# return dropdown list options
@app.route('/DropdownList')
@cross_origin()
def getDropdownList():
    demoList = ["Demo",
                "2171 - Information systems analysts and consultants",
                "2172 - Database analysts and data administrators",
                "2173 - Software engineers and designers",
                "2174 - Computer programmers and interactive media developers",
                "2283 - Information systems testing technicians",
                "9222 - Supervisors, electronics manufacturing"]
    return jsonify(demoList)


if __name__ == '__main__':
    app.run(host=os.getenv('IP', 'selene.research.cs.dal.ca'), 
            port=int(os.getenv('PORT', 8060)),
            debug=True)
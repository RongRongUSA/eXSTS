/**
 * create global variable to save job ads, NOC content and sentence pari cosine score
 * website start from the comparison between 194 job ads and 2171 NOC
 */
var jobIndex = '194';
var NOCIndex = '2283';
var job_ads_sentences = null;
var NOC_sentences = null;
var cosine_score = null;
loadTop5List();
loadJobContent();
loadNOCContent();
addButtons();
curveStartUp(true, true)
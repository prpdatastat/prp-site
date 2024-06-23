const fetch = require('sync-fetch')
function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}


const candData = load_data('./cand_data.json')
const fcpsMerit = load_data('./fcps_merit.json')
const msMerit = load_data('./ms_merit.json')
const mdMerit = load_data('./md_merit.json')




function checkKeys(item) {
  const keysToCheck = ["FCPS", "MS", "MD"];
  const result = {};
  keysToCheck.forEach((key) => {
    result[key] = item.hasOwnProperty(key);
  });
  return result;
}
function getCandidatesNumber () {
    
    let counter = {
        FCPS : 0,
        MS : 0,
        MD : 0
    }
    for (const key in candData) {
        if (candData.hasOwnProperty(key)) {
          const item = candData[key];
          const keyCheckResult = checkKeys(item);
          for (k in keyCheckResult) {
            if (keyCheckResult[k]) {
                counter[k]++
            }
          }
        }
      }
    return counter
}

function getCandidatesData(applicantId) {

  

    const progs = ['FCPS', 'MS', 'MD']
    let result = {}
    if (candData.hasOwnProperty(applicantId)) {
        result['applicantId'] = applicantId
        result['name'] = candData[applicantId]['nameFull']
        result['pmdcNo'] = candData[applicantId]['pmdcNo']        
        progs.forEach( prog => {
            result[prog] = []
            if (candData[applicantId].hasOwnProperty(prog)){
                if (candData[applicantId][prog].selected[0].quota != null) {
                    let obj = candData[applicantId][prog].selected[0];
                    obj.symbol = '✔'
                    result[prog].push(
                        obj
                    )
                }
                for (pref in candData[applicantId][prog].left) {
                    let obj = candData[applicantId][prog].left[pref];
                    obj.symbol = '✘'
                    result[prog].push(
                        obj
                    )
                }
            }
            result[prog].sort( (a,b) => (a.preferenceNo - b.preferenceNo))
        })


    }

    return result

    }


 
function getMerit(merit,  quota='', speciality='', hospital='', all=false) {    

    let result = [];
    for (prog in merit) {
        for (quot in merit[prog]) {
            if (quota === quot || quota === '') 
                for (specia in merit[prog][quot]) {
                    if (specia === speciality || speciality === '')
                        {
                    for (hosp in merit[prog][quot][specia]) {
                        if (hosp === hospital || hospital === '') {
                        for (cand in merit[prog][quot][specia][hosp].candidates) {
                            let obj = merit[prog][quot][specia][hosp].candidates[cand]
                            obj.quotaName = quot
                            obj.specialityName = specia
                            obj.hospitalName = hosp
                            obj.symbol = '✔'
                            result.push(obj)
                        }
                        if (all) {
                            for (cand in merit[prog][quot][specia][hosp].others) {
                                let obj = merit[prog][quot][specia][hosp].others[cand]
                                obj.quotaName = quot
                                obj.specialityName = specia
                                obj.hospitalName = hosp
                                obj.symbol = '✖'
                                result.push(obj)
                            }

                        }
                    }
                }
            }
        }
    }

            

            
    }
    result.sort( (a,b) => (b.marksTotal - a.marksTotal))
   
    return result
}


function getOptions(optionType) {
    console.log('optiontype', optionType)
    let result = [];
    if (optionType === 'quota') {
        for (prog in fcpsMerit) {
            for (quota in fcpsMerit[prog]) {
                console.log(quota, !result.includes(quota))
                if (!result.includes(quota)) {
                    result.push(quota)
                }
            }
        }
    }
    if (optionType === 'speciality') {
        for (prog in fcpsMerit) {
            for (quota in fcpsMerit[prog]) {
                for (specia in fcpsMerit[prog][quota]) 
                    {
                        if (!result.includes(specia)) {
                            result.push(specia)
                        }
                    }
                
            }
        }
    }
    if (optionType === 'hospital') {
        for (prog in fcpsMerit) {
            for (quota in fcpsMerit[prog]) {
                for (specia in fcpsMerit[prog][quota]) 
                    {
                        for (hospital in fcpsMerit[prog][quota][specia])
                            {
                        if (!result.includes(hospital)) {
                            result.push(hospital)
                        }
                    }
                
            }
        }
    }
    }
    if (optionType === 'program') {
        return ['FCPS', 'MS', 'MD']
    }
    return result
}


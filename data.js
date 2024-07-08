
const fetch = require('sync-fetch')
function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}

/*
const candData = load_data('./cand_data.json')
*/
const fcpsMerit = load_data('./fcps_merit.json')
const msMerit = load_data('./ms_merit.json')
const mdMerit = load_data('./md_merit.json')
const seats = load_data('./seats.json')
const accuracyMerit = load_data('./merit_stats.json')
const changes = load_data('./merit_diff.json')
/*
const changes = load_data('./changes.json')


*/

/*
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

    let data = {
        FCPS : fcpsMerit,
        MS : msMerit,
        MD : mdMerit
    }
    let applicantsData = {
        FCPS : [],
        MS : [],
        MD : []
    }
    for (prog in data) {
        for ( quota in data[prog][prog]) {
            for (speciality in data[prog][prog][quota]) {
                for (hospital in data[prog][prog][quota][speciality]) {
                    if (data[prog][prog][quota][speciality][hospital].candidates.length > 0) {
                        for (cand in data[prog][prog][quota][speciality][hospital].candidates) {
                            
                            let obj = data[prog][prog][quota][speciality][hospital].candidates[cand]
                            if (!applicantsData[prog].includes(obj.applicantId)) {
                                
                            applicantsData[prog].push(obj.applicantId)
                            }

                        }
                    }
                    if (data[prog][prog][quota][speciality][hospital].others.length > 0) {
                        for (cand in data[prog][prog][quota][speciality][hospital].others) {
                            let obj = data[prog][prog][quota][speciality][hospital].others[cand]
                            if (!applicantsData[prog].includes(obj.applicantId)) {
                                applicantsData[prog].push(obj.applicantId)
                            }

                        }
                    }
                }

            }
        }
        counter[prog] = applicantsData[prog].length
    }

    return counter
}
*/
function gotoUrl(link = 'index.html') {
    window.location.href = link
}

/*
function getCandidatesData(pmdcNo) {

  

    const progs = ['FCPS', 'MS', 'MD']
    let result = {}
    for (applicantId in candData) {
        if (candData[applicantId].pmdcNo.toLowerCase() == pmdcNo.toLowerCase())
            {
                result['select'] = {
                    FCPS : {},
                    MD : {},
                    MS : {}
                }
        result['applicantId'] = applicantId
        result['name'] = candData[applicantId]['nameFull']
        result['pmdcNo'] = candData[applicantId]['pmdcNo']       
        result['matric'] = candData[applicantId]['matric']
        result['inter'] = candData[applicantId]['fsc']
        result['degree'] = candData[applicantId]['degree']
        result['houseJob'] = parseFloat(candData[applicantId]['houseJob'].toFixed(2))
        result['experience'] = candData[applicantId]['experience'] 
        result['provMarks'] = parseFloat((candData[applicantId]['matric'] + candData[applicantId]['degree'] + candData[applicantId]['fsc'] + candData[applicantId]['houseJob'] + candData[applicantId]['experience']).toFixed(5))
        result['progMarks'] = {
            FCPS : 0.0,
            MS : 0.0,
            MD : 0.0
        }
        progs.forEach( prog => {
            result[prog] = []            
            if (candData[applicantId].hasOwnProperty(prog)){
                if (candData[applicantId][prog].selected[0].quotaName != null) {
                    let obj = candData[applicantId][prog].selected[0];
                    obj.symbol = '✔'
                    result['select'][prog] = obj
                    if (prog === 'FCPS') {
                        
                    result.progMarks[prog] = 40 

                    }
                    else {
                        result.progMarks[prog] = candData[applicantId].marksProgram

                    }
                    result[prog].push(
                        obj
                    )
                }
                for (pref in candData[applicantId][prog].left) {
                    let obj = candData[applicantId][prog].left[pref];
                    
                    if (prog === 'FCPS') {
                        
                        result.progMarks[prog] = 40 
    
                        }
                        else {
                            result.progMarks[prog] = candData[applicantId].marksProgram
    
                        }
                    obj.symbol = '✘'
                    result[prog].push( 
                        obj
                    )
                }
            }
            result[prog].sort( (a,b) => (a.preferenceNo - b.preferenceNo))
        })

    }
}

    return result

    }
*/

 
function getMerit(merit,  quota='', speciality='', hospital='', all=false) {    

    let result = [];
    console.log('selected quota', quota, 'speciality', speciality, 'hospital', hospital);
    for (prog in merit) {
        for (quot in merit[prog]) {
            if (quota === quot || quota === '') {
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
                            if (all)
                                {
                                    obj.symbol = '-'  
                                }
                                else 
                                {
                                    
                                obj.symbol = '✔'
                                }
                            result.push(obj)
                        }
                        if (all) {
                            for (cand in merit[prog][quot][specia][hosp].others) {
                                let obj = merit[prog][quot][specia][hosp].others[cand]
                                obj.specialityName = specia
                                obj.hospitalName = hosp
                                
                                obj.quotaName = quot
                                if (obj.selected_in.hospitalName === null ) {
                                    
                                obj.symbol = '✖'
                                }
                                else {
                                    obj.symbol = '✔'
                                }
                                result.push(obj)
                            }

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


function gethospitalOptions(optionType, hospital) {
 
    let result = [];
    
    if (optionType == 'quota')
        {
            seats.forEach(item => {
                if (item.hospitalName == hospital) {
                if (!result.includes(item.quotaName)) {
                    result.push(item.quotaName)
                }
            }
        })
        }
    if (optionType == "speciality") {
        seats.forEach(item => {
            if (item.hospitalName == hospital) {
                if (!result.includes(item.specialityName)) {
                    result.push(item.specialityName)
                }
            }
        })
    }
    

    if (optionType === 'program') {
        return ['FCPS', 'MS', 'MD']
    }
    return result
    }


function getspecialityOptions(optionType, speciality) {
    let result = [];
    
    if (optionType == 'quota')
        {
            seats.forEach(item => {
                if (item.specialityName == speciality) {
                if (!result.includes(item.quotaName)) {
                    result.push(item.quotaName)
                }
            }
        })
        }
    if (optionType == "hospital") {
        seats.forEach(item => {
            if (item.specialityName == speciality) {
                if (!result.includes(item.hospitalName)) {
                    result.push(item.hospitalName)
                }
            }
        })
    }
    

    if (optionType === 'program') {
        return ['FCPS', 'MS', 'MD']
    }
    return result
}

function parseNumberth(string ) {

    const numberth = {
        
        "1" : "st",
        "2" : "nd",
        "3": "rd",      

    }

    let last = string.slice(-1)
    if (last in numberth) {
        return string+numberth[last]
    }
    else { return string+"th"}
}

async function getSchedule() { 
    try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/schedule',
            type: 'GET',
            dataType: 'json'
        });

        if ('data' in response) {
            console.log('response', response['data']);
            return response['data'];
        }
    } catch (error) {
        console.log('error');
    }
    }
async function getConsent(applicantId) { 
    try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/consent/'+applicantId.toString(),
            type: 'GET',
            dataType: 'json'
        });
            
            return response['status'];
        
    } catch (error) {
        console.log('error');
    }
    }
function getChanges(program) 
{
    let result = [];
    console.log(changes, program in changes)
    if (program in changes) {
        for (quot in changes[program])
        {
            for (specia in changes[program][quot])
            {
                for (hosp in changes[program][quot][specia])
                {
                    let obj = Object()
                    obj.quotaName = quot
                    obj.specialityName = specia
                    obj.hospitalName = hosp
                    obj.selected = changes[program][quot][specia][hosp].selected
                    obj.not_selected = changes[program][quot][specia][hosp].not_selected
                   result.push(
                    obj
                   )
                }
            }
        
    }
        }
        console.log(result);
return result
}


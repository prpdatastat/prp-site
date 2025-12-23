const fetch = require('sync-fetch');

function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}
function ViewMeritList(link = '/prp-site/2025/merit.html') {
    window.location.href = link
}



function changeNotification(text) {
    document.getElementById('notif').innerHTML = text
}
const gazetteFCPS = load_data('../2025/fcps_gazat.json')
const cand_data = load_data('../2025/cand_data.json')
const gazetteMS = load_data('../2025/ms_gazat.json')
const gazetteMD = load_data('../2025/md_gazat.json')
const msMerit = load_data('../2025/ms_merit.json')
const mdMerit = load_data('../2025/md_merit.json')
const fcpsMerit = load_data('../2025/fcps_merit.json')
const issueIds = load_data('./candmarks_issue.json')
let candData = {};
let candGazetteData = {
    FCPS: gazetteFCPS,
    MS : gazetteMS,
    MD : gazetteMD
};

let candidates = {
    FCPS : gazetteFCPS.length,
    MS : gazetteMS.length,
    MD : gazetteMD.length
}
function toFixedNumber(num, digits, base){
    const pow = Math.pow(base ?? 10, digits);
    return Math.round(num*pow) / pow;
  }
function onlyRejected()  {
    let result = [];
    let promises = [];

    for (let app in cand_data) {
        let promise = new Promise((resolve, reject) => {
            $.get('https://prp-api.vercel.app/rejection/' + app, function(data) {
                if (data != 'Either the applicant is not checked yet or it is not rejected!') {
                    result.push({
                        applicantId: app,
                        nameFull: cand_data[app].nameFull,
                        pmdcNo: cand_data[app].pmdcNo
                    });
                }
                resolve();
            }).fail(reject);
        });
        promises.push(promise);
    }

    return Promise.all(promises).then(() => result);
    
    }


function makeSimpleList() {
    let result = [];
    for (app in cand_data) {   
        result.push(
            {
                applicantId : app,
                nameFull : cand_data[app].nameFull,
                pmdcNo : cand_data[app].pmdcNo                
            }
        )
    }
    return result
}
  
for (cand in candData) {
    let cData = candData[cand];
    for (prog in cData.applied_in) {
        if (cData.applied_in[prog])
            {
            candGazetteData[prog].push({
                applicantId : cand,
                pmdcNo: cData.pmdcNo,
                nameFull: cData.nameFull,
                marksTotal : cData.marksTotal,     
                marksProgram : parseFloat(cData.marksTotal + toFixedNumber(cData.programMark[prog], 5))      
                
            });
        }
    }
}

console.log(candidates)
function getApplicantId(pmdcNo) {
    for (applicantId in cand_data) {
        console.log(cand_data[applicantId])
        if (cand_data[applicantId].pmdcNo.toLowerCase().trim() == pmdcNo.toLowerCase().trim())
        {
            return applicantId
        }
}

}
function getGazetteData(prog) {
    return candGazetteData[prog];
}

function getCandidatesData(applicantId) {
    console.log(cand_data[applicantId])
    return cand_data[applicantId];
  
    }
    async function getReason(applicantId) { 
     

        try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/rejection/'+applicantId.toString(),
            type: 'GET',
        });
            return response.toString();
        
    } catch (error) {
        console.log('error');
    }
    
    
    }


async function getScrutiny(applicantId) { 
     

    try {
    let response = await $.ajax({
        url: 'https://prp-api.vercel.app/scrutiny/'+applicantId.toString(),
        type: 'GET',
    });
        return response.status.toString();
    
} catch (error) {
    console.log('error');
}


}

function getMerit(merit,  quota='', speciality='', hospital='', all=false) {    

    let result = [];
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
function changeHeadline(data) {
    let headline = `Showing merit list of ${data.program} candidates who applied`;

    if (data.quota) {
        headline += ` for quota ${data.quota}`;
    }

    if (data.speciality) {
        headline += ` in ${data.speciality}`;
    }

    if (data.hospital) {
        headline += ` at ${data.hospital}`;
    }

    return headline;
}
function getSeatsOccupied(data, prog, quotaName, hospitalaname, specialityName) {
    if (quotaName !== '')
    {
        if (quotaName in data[prog]) {
            if (specialityName != '')
                {
                    if (specialityName in data[prog][quotaName]) {
                        if (hospitalaname != '')
                        {
                            if (hospitalaname in data[prog][quotaName][specialityName]) {
                                return {
                                    occupied : data[prog][quotaName][specialityName][hospitalaname].candidates.length,
                                    total : data[prog][quotaName][specialityName][hospitalaname].jobs
                
                                }
                            }
                        }
                        
                    }
                }
            
        }
    }
    
    return {
        occupied : 0,
        total : 0
    }
}

function getOptions(optionType) {
    let result = [];
    if (optionType === 'quota') {
        for (prog in mdMerit) {
            for (quota in mdMerit[prog]) {
                if (!result.includes(quota)) {
                    result.push(quota)
                }
            }
        }
        for (prog in msMerit) {
            for (quota in msMerit[prog]) {
                if (!result.includes(quota)) {
                    result.push(quota)
                }
            }
        }
        for (prog in fcpsMerit) {
            for (quota in fcpsMerit[prog]) {
                if (!result.includes(quota)) {
                    result.push(quota)
                }
            }
        }
    }
    if (optionType === 'speciality') {
        for (prog in mdMerit) {
            for (quota in mdMerit[prog]) {
                for (specia in mdMerit[prog][quota]) 
                    {
                        if (!result.includes(specia)) {
                            result.push(specia)
                        }
                    }
                
            }
        }
        for (prog in msMerit) {
            for (quota in msMerit[prog]) {
                for (specia in msMerit[prog][quota]) 
                    {
                        if (!result.includes(specia)) {
                            result.push(specia)
                        }
                    }
                
            }
        }
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
        for (prog in mdMerit) {
            for (quota in mdMerit[prog]) {
                for (specia in mdMerit[prog][quota]) 
                    {
                        for (hospital in mdMerit[prog][quota][specia])
                            {
                        if (!result.includes(hospital)) {
                            result.push(hospital)
                        }
                    }
                
            }
        }
    }
    for (prog in msMerit) {
        for (quota in msMerit[prog]) {
            for (specia in msMerit[prog][quota]) 
                {
                    for (hospital in msMerit[prog][quota][specia])
                        {
                    if (!result.includes(hospital)) {
                        result.push(hospital)
                    }
                }
            
        }
    }
}
for (prog in fcpsMeritMerit) {
        for (quota in fcpsMerit[prog]) {
            for (specia in fcpsMerit[prog][quota]) 
                {
                    for (hospital in msMerit[prog][quota][specia])
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
async function getConsent(applicantId, inductionId = 18, round = 3) {      

    try {
    let response = await $.ajax({
        url: 'https://prp-api.vercel.app/consent/'+applicantId.toString()+"/"+ inductionId.toString()+"/"+ round.toString(),
        type: 'GET',
    });
        return response.toString();
    
} catch (error) {
    console.log('error');
}


}
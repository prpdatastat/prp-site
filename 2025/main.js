const fetch = require('sync-fetch');

function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}
function ViewMeritList(link = '../index.html') {
    window.location.href = link
    localStorage.setItem('viewUnofficial', true);
}




function changeNotification(text) {
    document.getElementById('notif').innerHTML = text
}
const gazetteFCPS = load_data('../2025/fcps_gazat.json')
const cand_data = load_data('../2025/cand_data.json')
const gazetteMS = load_data('../2025/ms_gazat.json')
const gazetteMD = load_data('../2025/md_gazat.json')
const issueIds = load_data('./candmarks_issue.json')
let candData = {};
let candGazetteData = {
    FCPS: gazetteFCPS,
    MS : gazetteMS,
    MD : gazetteMD
};

let candidates = {
    FCPS : gazetteFCPS[0].totalCount,
    MS : gazetteMS[0].totalCount,
    MD : gazetteMD[0].totalCount
}
function toFixedNumber(num, digits, base){
    const pow = Math.pow(base ?? 10, digits);
    return Math.round(num*pow) / pow;
  }


  /*
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
            candidates[prog]++;
        }
    }
}
*/


function getGazetteData(prog) {
    return candGazetteData[prog];
}

function getCandidatesData(applicantId) {
    console.log(cand_data[applicantId])
    return cand_data[applicantId];
  
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

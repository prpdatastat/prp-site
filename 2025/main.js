const fetch = require('sync-fetch');

function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}


const candData = load_data('./applicants2025.json').data
let candGazetteData = {
    FCPS: [],
    MS : [],
    MD : []
};
let candidates = {
    FCPS : 0,
    MS : 0,
    MD : 0
}
function toFixedNumber(num, digits, base){
    const pow = Math.pow(base ?? 10, digits);
    return Math.round(num*pow) / pow;
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
            candidates[prog]++;
        }
    }
}

function getGazetteData(prog) {
    return candGazetteData[prog];
}
function getCandidatesData(applicantId) {
    let data =  candData[applicantId];
    for (prog in data.applied_in) {
        if (data.applied_in[prog])

            data.preference[prog].forEach((pref) => {
                pref.marksTotal = data.marksTotal + toFixedNumber(data.programMark[prog], 5);
                if (pref.parentInstitute)
                {
                    pref.marksTotal += toFixedNumber(5, 5);
                    pref.symbol = '✓';
                }
                else {
                    pref.symbol = '✗';
                }

    })
}
console.log(data);
return data;
};
    
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



const fetch = require('sync-fetch');

function load_data(path) {
    
   const data = fetch(path).json();
   return data;
}

function changeNotification(text) {
    document.getElementById('notif').innerHTML = text
}
const prevMsMeritList = load_data('./ms_merit.json')
const prevMdMeritList = load_data('./md_merit.json')
const prevfcpsMeritList = load_data('./fcps_merit.json')
const prevcandList = load_data('./cand_data.json')
// const candDataUnOfficial = load_data('./2025/cand_data.json')
//const fcpsMeritUnOfficial = load_data('./2025/fcps_merit.json')
//const msMeritUnOfficial = load_data('./2025/ms_merit.json')
//const mdMeritUnOfficial = load_data('./2025/md_merit.json')
let fcpsGazat = load_data('./2025/fcps_gazat.json')
let msGazat = load_data('./2025/ms_gazat.json')
let mdGazat = load_data('./2025/md_gazat.json')
const constGazat = {
    FCPS : fcpsGazat,
    MS : msGazat,
    MD : mdGazat
}
const upgList = load_data('./upgradationEstimate.json')
let candData = prevcandList
let fcpsMerit = prevfcpsMeritList
let msMerit = prevMsMeritList
let mdMerit = prevMdMeritList
const constData = {
    FCPS : fcpsMerit,
    MS : msMerit,
    MD : mdMerit
}
function getUpgList(prog, quot = '', spe = '', hos = '') {
    let  result = []
    for (quota in upgList[prog]){
        if (quota === quot || quot === '')
        {
           for (spec in upgList[prog][quota]) {
            if (spec === spe || spe === '')
            {
            for (hosp in upgList[prog][quota][spec]) { 
                if (hosp === hos || hos === '')
                {
                if (upgList[prog][quota][spec][hosp].new.length == 0 && upgList[prog][quota][spec][hosp].prev.length == 0) {
                    result.push({
                        quotaName : quota,
                        specialityName : spec,
                        hospitalName : hosp,
                        change : 'Unchanged',
                        previous : 'Unchanged',
                        status : 'Same candidate!'
                    })
                if (upgList[prog][quota][spec][hosp].new.length == 0) {
                    if (upgList[prog][quota][spec][hosp].prev.length != 0) {
                        for (let i = 0; i < upgList[prog][quota][spec][hosp].new.length; i++) {
                            let statusI = '';
                            if (upgList[prog][quota][spec][hosp].prev[i].consent == 1) {
                                statusI = 'Previous candidate <span class="apphov"> <strong>upgraded</span> to higher preference of their choice';
                            }
                            if (upgList[prog][quota][spec][hosp].prev[i].consent == 2) {
                                statusI = '<span class="infos"> <strong>Previous candidate didnot give consent</strong></span>';
                            }
                            result.push({
                                quotaName : quota,
                                specialityName : spec,
                                hospitalName : hosp,
                                change : 'Unchanged',
                                previous : upgList[prog][quota][spec][hosp].prev[i].nameFull+"<br>Selected at preference <span class='important'>"+upgList[prog][quota][spec][hosp].prev[i].preferenceNo+"</span><br>with marks <span class='apphov'>"+upgList[prog][quota][spec][hosp].prev[i].marksTotal+"</span>",
                                status: 'Seat left Vacant'
                            })
                          }  
                    }

                }
                }
                else {
                    for (let i = 0; i < upgList[prog][quota][spec][hosp].new.length; i++) {
                        let statusI = '';
                        if (upgList[prog][quota][spec][hosp].prev[i].consent == 1) {
                            statusI = 'Previous candidate <span class="apphov"> <strong>upgraded</span> to higher preference of their choice';
                        }
                        if (upgList[prog][quota][spec][hosp].prev[i].consent == 2) {
                            statusI = '<span class="infos"> <strong>Previous candidate didnot give consent</strong></span>';
                        }
                        result.push({
                            quotaName : quota,
                            specialityName : spec,
                            hospitalName : hosp,
                            change : upgList[prog][quota][spec][hosp].new[i].nameFull+"<br>Selected at preference <span class='important'>"+upgList[prog][quota][spec][hosp].new[i].preferenceNo+"</span><br>with marks <span class='apphov'>"+upgList[prog][quota][spec][hosp].new[i].marksTotal+"</span>",
                            previous : upgList[prog][quota][spec][hosp].prev[i].nameFull+"<br>Selected at preference <span class='important'>"+upgList[prog][quota][spec][hosp].prev[i].preferenceNo+"</span><br>with marks <span class='apphov'>"+upgList[prog][quota][spec][hosp].prev[i].marksTotal+"</span>",
                            status: statusI
                        })
                      }                   

                }
            }
        }
    }
}
        }
    }
    return result
}

function toggleMerit() {    
    localStorage.setItem('viewUnofficial', !localStorage.getItem('viewUnofficial'));
}

const seats = load_data('./seats.json')
const accuracyMerit = load_data('./stats.json')
const changes = load_data('./changes.json')
const prevMerit = load_data('./previous_merits.json')
const rejected = load_data('./rejected.json')
/*
const changes = load_data('./changes.json')


*/

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
 function getPreviousMerits(year= '', month ='', round='', program='') { 
    
    let result = [];
    if (year == '')
        {
            
        return  Object.keys(prevMerit)      
        
        }
    if (month == '')
        {
        return Object.keys(prevMerit[year])
        }
    if (round == '')
        {
        return Object.keys(prevMerit[year][month])
        }
    if (program != '')
        {
        return { program : prevMerit[year][month][round][program]}
        }
    }
    

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

function gotoUrl(link = 'index.html') {
    window.location.href = link
}


function getCandidatesData(pmdcNo) {

  

    const progs = ['FCPS', 'MS', 'MD']
    let result = {}
    for (applicantId in candData) {
        if (candData[applicantId].pmdcNo.toLowerCase().trim() == pmdcNo.toLowerCase().trim())
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
        result['hardArea'] = candData[applicantId]['hardArea'] 
        result['provMarks'] = parseFloat((candData[applicantId]['matric'] + candData[applicantId]['degree'] + candData[applicantId]['fsc'] + candData[applicantId]['houseJob'] + candData[applicantId]['experience']).toFixed(5))
        result['progMarks'] = candData[applicantId]['programMarks']
        progs.forEach( prog => {
            result[prog] = []            
            if (candData[applicantId].hasOwnProperty(prog)){
                if (candData[applicantId][prog].selected[0].quotaName != null) {
                    let obj = candData[applicantId][prog].selected[0];
                    obj.symbol = '✔'
                    result['select'][prog] = obj
                    /*
                    if (prog === 'FCPS') {
                        
                    result.progMarks[prog] = 40 

                    }
                    else {
                        result.progMarks[prog] = candData[applicantId].marksProgram

                    }*/
                    result[prog].push(
                        obj
                    )
                }
                for (pref in candData[applicantId][prog].left) {
                    let obj = candData[applicantId][prog].left[pref];
                    /*
                    if (prog === 'FCPS') {
                        
                        result.progMarks[prog] = 40 
    
                        }
                        else {
                            result.progMarks[prog] = candData[applicantId].marksProgram
    
                        }*/
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


 
function getMerit(merit, quota = '', speciality = '', hospital = '', all = false) {
    let result = [];
    let seen = new Set(); // To track unique candidate+quota+speciality+hospital

    for (let prog in merit) {
        for (let quot in merit[prog]) {
            if (quota === quot || quota === '') {
                for (let specia in merit[prog][quot]) {
                    if (specia === speciality || speciality === '') {
                        for (let hosp in merit[prog][quot][specia]) {
                            if (hosp === hospital || hospital === '') {
                                // Candidates
                                for (let cand in merit[prog][quot][specia][hosp].candidates) {
                                    let obj = merit[prog][quot][specia][hosp].candidates[cand];
                                    obj.quotaName = quot;
                                    obj.specialityName = specia;
                                    obj.hospitalName = hosp;
                                    obj.symbol = all ? '-' : '✔';

                                    // Unique key for this candidate in this context
                                    let uniqueKey = obj.applicantId + '|' + quot + '|' + specia + '|' + hosp;
                                    if (!seen.has(uniqueKey)) {
                                        result.push(obj);
                                        seen.add(uniqueKey);
                                    }
                                }
                                // Others (if all)
                                if (all) {
                                    for (let cand in merit[prog][quot][specia][hosp].others) {
                                        let obj = merit[prog][quot][specia][hosp].others[cand];
                                        obj.specialityName = specia;
                                        obj.hospitalName = hosp;
                                        obj.quotaName = quot;
                                        obj.symbol = (obj.selected_in.hospitalName === null) ? '✖' : '✔';

                                        let uniqueKey = obj.applicantId + '|' + quot + '|' + specia + '|' + hosp;
                                        if (!seen.has(uniqueKey)) {
                                            result.push(obj);
                                            seen.add(uniqueKey);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    result.sort((a, b) => (b.marksTotal - a.marksTotal));
    return result;
}


function getOptions(optionType) {
    let result = [];
    if (optionType === 'quota') {
        for (prog in fcpsMerit) {
            for (quota in fcpsMerit[prog]) {
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


function showNearMeritMatches() {
  const merit = parseFloat(document.getElementById("merit-input").value);
  const program = document.getElementById("merit-program").value;
  const threshold = parseFloat(document.getElementById("merit-threshold").value) || 3;
  const filterSpeciality = document.getElementById("filter-speciality").value.toLowerCase().trim();
  const filterHospital = document.getElementById("filter-hospital").value.toLowerCase().trim();

  if (isNaN(merit)) {
    alert("Please enter a valid merit score.");
    return;
  }

  const data = meritData[program];
  const closeList = [];

  const usingFilter = !!(filterSpeciality || filterHospital);
  const allowThresholdMatch = !usingFilter && threshold > 0;

  if (!usingFilter && !allowThresholdMatch) {
    alert("Please enter either a filter (speciality/hospital) or a valid threshold.");
    return;
  }

  for (let quota in data[program]) {
    for (let speciality in data[program][quota]) {
      for (let hospital in data[program][quota][speciality]) {
        const candidates = data[program][quota][speciality][hospital]["candidates"];
        if (!Array.isArray(candidates)) continue;

        candidates.forEach(cand => {
          if (cand.selected === false) return;
          const score = parseFloat(cand.marksTotal);
          const delta = score - merit;

          const matchSpeciality = speciality.toLowerCase().includes(filterSpeciality);
          const matchHospital = hospital.toLowerCase().includes(filterHospital);

          const passesFilters =
            (filterSpeciality ? matchSpeciality : true) &&
            (filterHospital ? matchHospital : true);

          if (
            (usingFilter && passesFilters) ||
            (allowThresholdMatch && Math.abs(delta) <= threshold)
          ) {
            closeList.push({
              name: cand.nameFull || "-",
              score: score,
              delta: delta.toFixed(2),
              hospital: hospital,
              speciality: speciality,
              quota: quota
            });
          }
        });
      }
    }
  }

  closeList.sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));

  const table = $("#statTable").DataTable();
  table.clear().draw();

  closeList.forEach(item => {
    const gradient = getGradientColor(item.delta);
    table.row.add([
      "-", item.name, item.quota,
      `<span style="color:${gradient};font-weight:bold;">${item.speciality}</span>`,
      `<span style="color:${gradient};font-weight:bold;">${item.hospital}</span>`,
      item.score,
      (item.delta > 0 ? "+" : "") + item.delta + " vs you"
    ]);
  });

  table.draw();

  const headline = document.getElementById("headline");
  headline.style.display = "block";
  headline.innerText = usingFilter
    ? `🔍 Matches for filters (Speciality: "${filterSpeciality}", Hospital: "${filterHospital}") with your merit (${merit})`
    : `🔍 Candidates within ±${threshold} marks of your merit (${merit})`;
}

function getGradientColor(delta) {
  const abs = Math.abs(delta);
  if (abs <= 0.5) return "#00ff88";
  if (abs <= 1.0) return "#66ff66";
  if (abs <= 2.0) return "#ffff66";
  return "#ff6666";
}


async function getSchedule() { 
    try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/schedule',
            type: 'GET',
            dataType: 'json'
        });

        if ('data' in response) {
            return response['data'];
        }
    } catch (error) {
        console.log('error');
    }
    }
async function getConsent(applicantId, inductionId = 19, round = 4) {      

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
    async function getScrutiny(applicantId) { 
     

        try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/scrutiny/'+applicantId.toString(),
            type: 'GET',
        });
            return "<strong>"+response.statusType.toString()+"</strong> "+response.status.toString();
        
    } catch (error) {
        console.log('error');
    }
    
    
    }
    async function getJoining(applicantId) { 
     

        try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/joining/'+applicantId.toString(),
            type: 'GET',
        });
            return response.toString();
        
    } catch (error) {
        console.log('error');
    }
    
    
    }

async function getConsentData(applicantId, inductionId = 19) { 
    

        try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/consent/'+applicantId.toString()+"/"+ inductionId.toString()+"/",
            type: 'GET',
        });
            console.log(response)
            return response;
        
    } catch (error) {
        console.log(error);
    }
    
    
    }
async function considerApplicant(applicantId, inductionId = 19) { 
    

        try {
        let response = await $.ajax({
            url: 'https://prp-api.vercel.app/consider/'+applicantId.toString()+"/"+ inductionId.toString()+"/",
            type: 'GET',
        });
            console.log(response)
            return response;
        
    } catch (error) {
        console.log(error);
    }
    
    
    }
    /*
    function checkMeritDataUnhinged() {
        if (localStorage.getItem('viewUnofficial'))
      {
      meritData.FCPS = fcpsMeritUnOfficial;
      meritData.MS = msMeritUnOfficial;
      meritData.MD = mdMeritUnOfficial;
      candData = candDataUnOfficial;
      if (document.getElementById('checkbox2025')){
        
        document.getElementById('checkbox2025').checked = true
        }
      
    }else {
      meritData.FCPS = prevfcpsMeritList;
      meritData.MS = prevMsMeritList;
      meritData.MD = prevMdMeritList;
      candData = prevcandList;
      if (document.getElementById('checkbox2025')){
        
      document.getElementById('checkbox2025').checked = false
      }
      }
    }*/
/*
function getChanges(program) 
{
    let result = [];
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
        
return result
}

*/
function getChanges(program) {
    return changes[program]
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

function goToId(e) {
    let txt = e.innerHTML;
    
}


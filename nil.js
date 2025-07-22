function gotSelectedIn(applicantId, meritData) {
  for (const program in meritData) {
    for (const quota in meritData[program]) {
      for (const spec in meritData[program][quota]) {
        for (const hospital in meritData[program][quota][spec]) {
          const candidateList = meritData[program][quota][spec][hospital].candidates;

          for (const cand of candidateList) {
            if (String(cand.applicantId) === String(applicantId)) {
              return {
                quotaName: quota,
                specialityName: spec,
                hospitalName: hospital,
                preferenceNo: cand.preferenceNo
              };
            }
          }
        }
      }
    }
  }

  return {
    quotaName: null,
    specialityName: null,
    hospitalName: null,
    preferenceNo: null
  };
}


async function getCandidates(program, filterSelected = false, params = {}) {
  const prog = program;
  const gazatData = constGazat[program];
  const meritData = constData[program];

  const candidates = [];
  const paramsReq = ['quotaName', 'specialityName', 'hospitalName'];
  const normalize = str => str?.toString().trim().toLowerCase();

  for (const app of gazatData) {
    for (const pref of app.preference) {
      console.log("pref values:", {
  quota: `"${pref.quotaName}"`,
  speciality: `"${pref.specialityName}"`,
  hospital: `"${pref.hospitalName}"`
});
console.log("params values:", {
  quota: `"${params.quotaName}"`,
  speciality: `"${params.specialityName}"`,
  hospital: `"${params.hospitalName}"`
});

      const matches = paramsReq.every(key =>
        
        normalize(pref[key]) === normalize(params[key])
      );

      if (matches) {
        const candSample = {
          nameFull: app.nameFull,
          marksTotal: app.marksTotal + pref.marks,
          pmdcNo: app.pmdcNo,
          applicantId: app.applicantId,
          preferenceNo: pref.preferenceNo,
          ...Object.fromEntries(paramsReq.map(k => [k, pref[k]]))
        };

        let isSelected = false;

        if (filterSelected) {
          const selectedList = meritData?.[prog]?.[pref.quotaName]?.[pref.specialityName]?.[pref.hospitalName]?.candidates || [];
          isSelected = selectedList.some(sel => sel.applicantId == candSample.applicantId);
        }

        if (!isSelected && !candidates.some(c => c.applicantId === candSample.applicantId)) {
          candidates.push(candSample);
        }
      }
    }
  }

  return candidates;
}

      

async function nextCandidateInLine(selectedCandidate, program, quota, speciality, hospital) {

  // Get candidates
  const candidates = await getCandidates(program, false, {quotaName : quota , specialityName  : speciality , hospitalName : hospital});
  if (!candidates || candidates.length === 0) return null;
  console.log(`Found ${candidates.length} candidates for program ${program}, quota ${quota}, speciality ${speciality}, hospital ${hospital}`, candidates);
  // Sort by marks descending
  const sortedCandidates = candidates.sort((a, b) => b.marksTotal - a.marksTotal);

  // Find index to start from
  let startIndex = 0;
  if (selectedCandidate.marksTotal !== undefined) {
    for (let i = 0; i < sortedCandidates.length; i++) {
      if (sortedCandidates[i].marksTotal <= selectedCandidate.marksTotal) {
        startIndex = i + 1;
        break;
      }
    }
  }
    const meritData =  constData[program]
  

  // Iterate through sorted candidates
  for (let i = startIndex; i < sortedCandidates.length; i++) {
    const candidate = sortedCandidates[i];
    
    const consider = await considerApplicant(candidate.applicantId, 19);
    if (consider.consider === false) {
      break
    }

    const selectedElsewhere = gotSelectedIn(candidate.applicantId, meritData);
    console.log(`Checking candidate ${candidate.nameFull} for preferenceNo ${candidate.preferenceNo} in ${candidate.specialityName} at ${candidate.hospitalName}`);

    if (selectedElsewhere.quotaName != null) {
      if (selectedElsewhere.preferenceNo > candidate.preferenceNo) {
        return candidate;
      } else {
        console.log(`Already selected at higher Preference ${selectedElsewhere.preferenceNo} in ${selectedElsewhere.specialityName} at ${selectedElsewhere.hospitalName}`);
      }
    } else {
      return candidate;
    }
  }

  return null;
}


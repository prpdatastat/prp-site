
function showNearMeritMatches() {
  const merit = parseFloat(document.getElementById("merit-input").value);
  const program = document.getElementById("merit-program").value;

  if (isNaN(merit)) {
    alert("Please enter a valid merit score.");
    return;
  }

  const data = meritData[program];
  const closeList = [];
  const threshold = 3;

  for (let quota in data) {
    for (let speciality in data[quota]) {
      for (let hospital in data[quota][speciality]) {
        const candidates = data[quota][speciality][hospital]["candidates"] || [];

        candidates.forEach(cand => {
          if (cand.selected === false) return;
          const score = parseFloat(cand.marksTotal);
          const delta = score - merit;
          if (Math.abs(delta) <= threshold) {
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
  document.getElementById("headline").innerText =
    `🔍 Candidates within ±${threshold} marks of your merit (${merit})`;
}

function getGradientColor(delta) {
  const abs = Math.abs(delta);
  if (abs <= 0.5) return "#00ff88";
  if (abs <= 1.0) return "#66ff66";
  if (abs <= 2.0) return "#ffff66";
  return "#ff6666";
}

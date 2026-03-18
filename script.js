//祝日取得
async function getHolidays() {
  const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");

  return await res.json();
}

//勤務時間計算
function calcHours(start, end) {
  const s = new Date(`1970-01-01T${start}`);
  const e = new Date(`1970-01-01T${end}`);

  let diff = (e - s) / 1000 / 60 / 60;

  // 昼休憩1時間
  diff -= 1;

  return diff;
}

//週報生成ロジック
async function generate() {
  const holidays = await getHolidays();

  const startDate = new Date(document.getElementById("startDate").value);

  const startTime = document.getElementById("startTime").value;

  const endTime = document.getElementById("endTime").value;

  const task = document.getElementById("task").value;

  let report = "";
  let weekTotal = 0;

  for (let i = 0; i < 7; i++) {
    let d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    let y = d.getFullYear();
    let m = d.getMonth() + 1;
    let day = d.getDate();

    let key = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

    let weekday = d.getDay();

    if (weekday === 0 || weekday === 6 || holidays[key]) {
      report += `${m}/${day} 休\n\n`;
    } else {
      let h = calcHours(startTime, endTime);

      weekTotal += h;

      report += `${m}/${day} ${startTime}~${endTime} ${h.toFixed(
        2
      )} ${task}\n\n`;
    }
  }

  report = `週計 ${weekTotal.toFixed(2)}H\n\n` + report;

  document.getElementById("result").value = report;
}

//メール送信
function sendMail() {
  const body = document.getElementById("result").value;

  location.href = `mailto:?subject=週報&body=${encodeURIComponent(body)}`;
}

//月累計自動計算
function updateMonthly(hours) {
  let month = new Date().getMonth() + 1;

  let key = "work_" + month;

  let total = Number(localStorage.getItem(key) || 0);

  total += hours;

  localStorage.setItem(key, total);

  return total;
}

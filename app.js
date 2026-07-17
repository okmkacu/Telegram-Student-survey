const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const API_URL = "https://script.google.com/macros/s/AKfycbz-_uPgG4EUqJwW_vHYKEHKrNdhGk3jvqv6lbqVyAqD1cpJ6jwKxEXDfGzgMstRqfvC/exec"; 
let selectedGender = "";

// Gender Button Selector
document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedGender = btn.dataset.gender;
    validateForm();
  });
});

// CGPA Real-time Input Check
const cgpaInput = document.getElementById('cgpa');
cgpaInput.addEventListener('input', validateForm);

function validateForm() {
  const cgpaValue = parseFloat(cgpaInput.value);
  const isValidCgpa = cgpaValue >= 1.0 && cgpaValue <= 4.0;
  document.getElementById('submit-btn').disabled = !(selectedGender && isValidCgpa);
}

// Check if user has already responded on app launch
window.addEventListener('DOMContentLoaded', async () => {
  const initData = tg.initData;
  if (!initData) {
    document.getElementById('loading').innerHTML = "<p style='color:red;'>Please open this inside Telegram!</p>";
    return;
  }

  try {
    const res = await fetch(`${API_URL}?initData=${encodeURIComponent(initData)}`);
    const data = await res.json();
    
    document.getElementById('loading').classList.add('hidden');
    if (data.status === "exists") {
      document.getElementById('duplicate-screen').classList.remove('hidden');
    } else {
      document.getElementById('form-screen').classList.remove('hidden');
    }
  } catch (err) {
    document.getElementById('loading').innerHTML = "<p style='color:red;'>Network connection error.</p>";
  }
});

// Post submission to clean 5-column Sheets backend
document.getElementById('survey-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').innerText = "Submitting...";

  const payload = {
    initData: tg.initData,
    gender: selectedGender,
    cgpa: cgpaInput.value
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: { "Content-Type": "text/plain" }, 
      body: JSON.stringify(payload)
    });

    document.getElementById('form-screen').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
    
    setTimeout(() => { tg.close(); }, 2500);
  } catch (err) {
    alert("Submission error, please try again.");
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('submit-btn').innerText = "Submit Form";
  }
});
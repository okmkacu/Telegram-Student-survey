const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const API_URL = "https://script.google.com/macros/s/AKfycbz-_uPgG4EUqJwW_vHYKEHKrNdhGk3jvqv6lbqVyAqD1cpJ6jwKxEXDfGzgMstRqfvC/exec"; 
let selectedGender = "";

// Gender Selector
document.querySelectorAll('.gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedGender = btn.dataset.gender;
    validateForm();
  });
});

// Dropdown/Input Validation Hooks
const departmentSelect = document.getElementById('department');
const cgpaInput = document.getElementById('cgpa');

departmentSelect.addEventListener('change', validateForm);
cgpaInput.addEventListener('input', validateForm);

function validateForm() {
  const cgpaValue = parseFloat(cgpaInput.value);
  const isValidCgpa = cgpaValue >= 1.0 && cgpaValue <= 4.0;
  const isDeptValid = departmentSelect.value !== "";
  
  document.getElementById('submit-btn').disabled = !(selectedGender && isDeptValid && isValidCgpa);
}

// Form Submission Posting Payload
document.getElementById('survey-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').innerText = "Submitting...";

  const payload = {
    initData: tg.initData,
    gender: selectedGender,
    department: departmentSelect.value,
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

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------
     Mobile nav toggle
  ----------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------
     Profile photo upload
     Stored in localStorage as a data URL so it
     persists between visits on this browser.
  ----------------------------------------- */
  const photoInput = document.getElementById('photoInput');
  const photoImg = document.getElementById('photoImg');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const photoEditBtn = document.getElementById('photoEditBtn');
  const PHOTO_KEY = 'portfolio_profile_photo';

  function showPhoto(dataUrl){
    photoImg.src = dataUrl;
    photoImg.hidden = false;
    photoPlaceholder.hidden = true;
    photoEditBtn.textContent = 'Change photo';
  }

  function loadSavedPhoto(){
    try{
      const saved = localStorage.getItem(PHOTO_KEY);
      if (saved) showPhoto(saved);
    }catch(err){
      console.warn('Could not load saved photo:', err);
    }
  }

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')){
      alert('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      showPhoto(dataUrl);
      try{
        localStorage.setItem(PHOTO_KEY, dataUrl);
      }catch(err){
        console.warn('Could not save photo (it may be too large for storage):', err);
      }
    };
    reader.onerror = () => alert('Sorry, that image could not be loaded.');
    reader.readAsDataURL(file);
  });

  loadSavedPhoto();

  /* -----------------------------------------
     CV / resume upload
     Stored in localStorage as a data URL.
  ----------------------------------------- */
  const cvInput = document.getElementById('cvInput');
  const cvDownload = document.getElementById('cvDownload');
  const cvRemove = document.getElementById('cvRemove');
  const resumeStatus = document.getElementById('resumeStatus');
  const CV_KEY = 'portfolio_cv_data';
  const CV_NAME_KEY = 'portfolio_cv_name';

  function showCv(dataUrl, fileName){
    cvDownload.href = dataUrl;
    cvDownload.download = fileName || 'CV.pdf';
    cvDownload.hidden = false;
    cvRemove.hidden = false;
    resumeStatus.textContent = fileName ? `Uploaded: ${fileName}` : 'CV uploaded';
  }

  function clearCv(){
    cvDownload.hidden = true;
    cvRemove.hidden = true;
    cvDownload.removeAttribute('href');
    resumeStatus.textContent = 'No CV uploaded yet';
  }

  function loadSavedCv(){
    try{
      const saved = localStorage.getItem(CV_KEY);
      const name = localStorage.getItem(CV_NAME_KEY);
      if (saved) showCv(saved, name);
    }catch(err){
      console.warn('Could not load saved CV:', err);
    }
  }

  cvInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf'){
      alert('Please choose a PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      showCv(dataUrl, file.name);
      try{
        localStorage.setItem(CV_KEY, dataUrl);
        localStorage.setItem(CV_NAME_KEY, file.name);
      }catch(err){
        console.warn('Could not save CV (it may be too large for storage):', err);
      }
    };
    reader.onerror = () => alert('Sorry, that file could not be loaded.');
    reader.readAsDataURL(file);
  });

  cvRemove.addEventListener('click', () => {
    clearCv();
    try{
      localStorage.removeItem(CV_KEY);
      localStorage.removeItem(CV_NAME_KEY);
    }catch(err){
      console.warn('Could not clear saved CV:', err);
    }
    cvInput.value = '';
  });

  loadSavedCv();

});
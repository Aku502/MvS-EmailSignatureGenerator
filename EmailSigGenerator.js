let isGenerated = false; 
// Async because we use await inside
async function generateSignature() {
  const fullName = document.getElementById('fullName').value.trim();
  const jobTitle = document.getElementById('jobTitle').value.trim();
  let email = document.getElementById('email').value.trim(); // <-- made email "let" because we modify it

  // Validate inputs
  if (!fullName || !jobTitle || !email) {
      Swal.fire({
          icon: 'warning',
          title: 'Missing Materials',
          text: 'All fields are required to forge the legendary signature!',
          confirmButtonText: 'OK'
      });
      return;
  }

  // Correct email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      Swal.fire({
          icon: 'error',
          title: 'Crafting Lvl too low',
          text: 'Your email must be properly crafted.',
          confirmButtonText: 'OK'
      });
      return;
  }

  // Studio email validation
  if (!email.includes('@')) {
      email = email + '@manvsskeletonstudio.com';
  } else if (!email.endsWith('@manvsskeletonstudio.com')) {
      Swal.fire({
          icon: 'warning',
          title: 'Guild Access Not Found',
          text: 'Email must bear the sacred sigil: @manvsskeletonstudio.com.',
          confirmButtonText: 'OK'
      });
      return;
  }

  // Generate the signature HTML
  try {
      const response = await fetch('SignatureTemplate.html');
      let template = await response.text();

      // Replace placeholders in the template with user input
      template = template.replace('{{fullName}}', fullName);
      template = template.replace('{{jobTitle}}', jobTitle);
      template = template.replace('{{email}}', email);

      document.getElementById('signatureOutput').value = template;
      isGenerated = true; 
  }
  catch (error) {
      console.error('Error fetching the template:', error);
      Swal.fire({
          icon: 'error',
          title: 'Forge Error',
          text: 'There was an error forging your signature. Please try again later.',
          confirmButtonText: 'OK'
      });
      isGenerated = false; 
  }
}

// Download the generated signature as an HTML file
function downloadSignature() {
  if (!isGenerated) {
      Swal.fire({
          icon: 'warning',
          title: 'No Forged Item',
          text: 'You cannot download what has not been forged yet! Generate the signature first.',
          confirmButtonText: 'OK'
      });
      return;
  } 
  // Get the generated signature HTML from the textarea
  const signatureHTML = document.getElementById('signatureOutput').value;

  // Create a Blob from the signature HTML content
  const blob = new Blob([signatureHTML], { type: 'text/html' });

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'email-signature.html'; // The name of the file

  // Trigger the download
  link.click();

  // Success alert with instructions after the download
  Swal.fire({
    icon: 'success',
    title: 'Quest Complete!',
    text: 'The Legendary Email Signature has been forged! It’s ready to wield in your inbox.',
    confirmButtonText: 'Got it!'
  });
}

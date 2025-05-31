// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Theme toggle - Improved version
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Function to set theme
function setTheme(theme) {
  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun text-teal-400"></i>';
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-moon text-teal-600"></i>';
  }
}

// Theme toggle event
themeToggle.addEventListener('click', () => {
  if (html.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  setTheme(savedTheme);
} else if (systemPrefersDark) {
  setTheme('dark');
} else {
  setTheme('light');
}

// Rest of your existing code...
const typed = new Typed('#typed-role', {
  strings: ['Data Science Engineer', 'Data Analytics', 'Software Developer', 'Tech Enthusiast'],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.remove('opacity-0', 'scale-0');
    backToTopButton.classList.add('flex', 'opacity-100', 'scale-100');
  } else {
    backToTopButton.classList.remove('flex', 'opacity-100', 'scale-100');
    backToTopButton.classList.add('opacity-0', 'scale-0');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('#mobile-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});


// Replace in your script
const options = {
  key: "rzp_test_YOUR_TEST_KEY", // Test key first
  amount: amount,
  currency: "INR",
  name: "Anshu's Portfolio Template",
  description: description,
  image: "https://yourdomain.com/logo.png",
  handler: async function(response) {
    // Send payment data to your backend
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_id: response.razorpay_payment_id,
        plan: plan,
        amount: amount
      })
    });
    
    if(res.ok) {
      window.location.href = '/thank-you';
    }
  },
  // ... rest of options
};



// For Backend service
// server.js
const express = require('express');
const Razorpay = require('razorpay');
const app = express();

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

app.post('/api/verify-payment', async (req, res) => {
  const { payment_id, plan } = req.body;
  
  try {
    const payment = await razorpay.payments.fetch(payment_id);
    
    if(payment.status === 'captured') {
      // Save to database
      await saveOrderToDB(payment, plan);
      
      // Send download link email
      await sendDownloadEmail(payment.email, plan);
      
      return res.sendStatus(200);
    }
  } catch(err) {
    console.error(err);
    return res.status(400).send('Payment verification failed');
  }
});


// File Dilevery system
// Email sending function
async function sendDownloadEmail(email, plan) {
  const downloadLink = `https://yourdomain.com/download/${generateToken()}`;
  
  await transporter.sendMail({
    from: 'sales@yourdomain.com',
    to: email,
    subject: 'Your Portfolio Template Download',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Download your ${plan} files:</p>
      <a href="${downloadLink}">Download Now</a>
      <p>License key: ${generateLicenseKey()}</p>
    `
  });
}

// Digital Download
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'ap-south-1' });

async function generateDownloadLink() {
  const command = new GetObjectCommand({
    Bucket: 'your-bucket',
    Key: 'portfolio-template-v1.zip'
  });
  
  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour expiry
}



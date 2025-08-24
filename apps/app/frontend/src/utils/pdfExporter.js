export const exportToPDF = (formData) => {
  const printWindow = window.open('', '_blank');
  const documentContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Professional Profile</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 40px;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          .document {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .name {
            font-size: 32px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 10px;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14px;
            color: #6b7280;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .info-item {
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
            font-size: 14px;
          }
          .info-value {
            color: #6b7280;
            margin-top: 5px;
          }
          .text-content {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          .placeholder {
            color: #d1d5db;
            font-style: italic;
          }
          @media print {
            body { margin: 0; padding: 0; }
            .document { box-shadow: none; margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="header">
            <div class="name">${formData.fullName || 'Your Name'}</div>
            <div class="contact-info">
              <div class="contact-item"> ${formData.email || 'your.email@example.com'}</div>
              <div class="contact-item"> ${formData.phone || '+1 (555) 123-4567'}</div>
              <div class="contact-item"> ${formData.address || 'Your Address'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${formData.dateOfBirth || 'Not specified'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Occupation</div>
                <div class="info-value">${formData.occupation || 'Not specified'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Company</div>
                <div class="info-value">${formData.company || 'Not specified'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Experience</div>
                <div class="info-value">${formData.experience || 'Not specified'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Skills</div>
            <div class="text-content">
              ${formData.skills || 'No skills listed'}
            </div>
          </div>

          <div class="section">
            <div class="section-title">About</div>
            <div class="text-content">
              ${formData.about || 'No description provided'}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(documentContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  User, 
  FileText,
  Briefcase,
  CreditCard,
  UserCheck
} from 'lucide-react';
import type { Registration } from '@/stores/registrations-store';
import { GENDER_OPTIONS, INDIAN_STATES } from '@/lib/constants';

interface PrintableApplicationFormProps {
  registration: Registration;
}

export function PrintableApplicationForm({ registration }: PrintableApplicationFormProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const getStateName = (code: string) => {
    return INDIAN_STATES.find(s => s.code === code)?.name || code;
  };

  const getGenderLabel = (value: string) => {
    return GENDER_OPTIONS.find(g => g.value === value)?.label || value;
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      pending: { 
        color: '#b45309', 
        backgroundColor: '#fef3c7', 
        borderColor: '#fcd34d' 
      },
      approved: { 
        color: '#059669', 
        backgroundColor: '#d1fae5', 
        borderColor: '#6ee7b7' 
      },
      rejected: { 
        color: '#dc2626', 
        backgroundColor: '#fee2e2', 
        borderColor: '#fca5a5' 
      },
    };
    return styles[status] || styles.pending;
  };

  return (
    <>
      {/* Print Button - Hidden when printing */}
      <div className="print-btn-container">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Application
        </Button>
      </div>

      {/* Application Form */}
      <div ref={printRef} className="application-form">
        {/* Header */}
        <div className="form-header">
          <h1 className="form-title">EMPLOYEE APPLICATION FORM</h1>
          <p className="form-subtitle">Manpower Service Provider</p>
          <div className="form-meta">
            <div>
              <span className="label">Application No: </span>
              <span className="value-bold">{registration.registrationCode}</span>
            </div>
            <div>
              <span className="label">Date: </span>
              <span className="value">{formatDate(registration.submittedAt)}</span>
            </div>
            <div 
              className="status-badge" 
              style={{ 
                padding: '4px 12px', 
                borderRadius: '4px', 
                border: '1px solid',
                fontSize: '12px',
                fontWeight: '500',
                ...getStatusStyle(registration.status)
              }}
            >
              {registration.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Photo Placeholder */}
        <div className="photo-container">
          <div className="photo-box">
            <User className="photo-icon" />
            <p className="photo-text">Passport Size Photo</p>
            <p className="photo-size">3.5cm x 4.5cm</p>
            {registration.documents.photo && (
              <p className="photo-attached">✓ Photo Attached</p>
            )}
          </div>
        </div>

        {/* Section A: Personal Details */}
        <div className="section">
          <h2 className="section-title">
            <User className="section-icon" />
            Section A: Personal Details
          </h2>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{registration.firstName} {registration.lastName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Father&apos;s Name:</span>
              <span className="detail-value">{registration.fatherName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mother&apos;s Name:</span>
              <span className="detail-value">{registration.motherName || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{formatDate(registration.dateOfBirth)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{getGenderLabel(registration.gender)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Blood Group:</span>
              <span className="detail-value">{registration.bloodGroup || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone Number:</span>
              <span className="detail-value">{registration.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{registration.email}</span>
            </div>
          </div>
          <div className="address-section">
            <span className="detail-label">Permanent Address:</span>
            <div className="address-box">
              {registration.permanentAddress}<br />
              {registration.permanentCity}, {getStateName(registration.permanentState)} - {registration.permanentPincode}
            </div>
          </div>
        </div>

        {/* Section B: Employment Preferences */}
        <div className="section">
          <h2 className="section-title">
            <Briefcase className="section-icon" />
            Section B: Employment Preferences
          </h2>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Applied Designation:</span>
              <span className="detail-value">{registration.designation}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Preferred Department:</span>
              <span className="detail-value">{registration.department || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Employment Type:</span>
              <span className="detail-value capitalize">{registration.employmentType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Expected Salary:</span>
              <span className="detail-value">₹{parseInt(registration.expectedSalary || '0').toLocaleString('en-IN')}/month</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Experience:</span>
              <span className="detail-value">{registration.experience || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Education:</span>
              <span className="detail-value">{registration.education || '-'}</span>
            </div>
          </div>
          {registration.skills && (
            <div className="address-section">
              <span className="detail-label">Skills & Certifications:</span>
              <div className="address-box">{registration.skills}</div>
            </div>
          )}
          {(registration.clientName || registration.unitName) && (
            <div className="address-section" style={{ marginTop: '12px' }}>
              <span className="detail-label">Work Location Applied:</span>
              <div className="address-box" style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
                {registration.clientName && <><strong>Client:</strong> {registration.clientName}</>}
                {registration.unitName && <><br /><strong>Unit:</strong> {registration.unitName} ({registration.unitCode})</>}
              </div>
            </div>
          )}
        </div>

        {/* Section C: Identity Documents */}
        <div className="section">
          <h2 className="section-title">
            <FileText className="section-icon" />
            Section C: Identity Documents
          </h2>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Aadhaar Number:</span>
              <span className="detail-value mono">{registration.aadhaarNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">PAN Number:</span>
              <span className="detail-value mono">{registration.panNumber || '-'}</span>
            </div>
          </div>
          <div className="checklist">
            <p className="checklist-title">Documents Checklist:</p>
            <div className="checklist-grid">
              {[
                { key: 'aadhaarCard', label: 'Aadhaar Card' },
                { key: 'panCard', label: 'PAN Card' },
                { key: 'photo', label: 'Passport Photo' },
                { key: 'bankPassbook', label: 'Bank Passbook/Cheque' },
                { key: 'education', label: 'Education Certificate' },
              ].map((doc) => (
                <div key={doc.key} className="checklist-item">
                  <span className={`check-box ${registration.documents[doc.key as keyof typeof registration.documents] ? 'checked' : 'unchecked'}`}>
                    {registration.documents[doc.key as keyof typeof registration.documents] ? '✓' : '✗'}
                  </span>
                  <span className={registration.documents[doc.key as keyof typeof registration.documents] ? '' : 'unchecked-text'}>
                    {doc.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section D: Bank Details */}
        <div className="section">
          <h2 className="section-title">
            <CreditCard className="section-icon" />
            Section D: Bank Details (for Salary Credit)
          </h2>
          <div className="details-grid">
            <div className="detail-row">
              <span className="detail-label">Bank Name:</span>
              <span className="detail-value">{registration.bankName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Number:</span>
              <span className="detail-value mono">{registration.bankAccountNo}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">IFSC Code:</span>
              <span className="detail-value mono">{registration.bankIfsc}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Branch:</span>
              <span className="detail-value">{registration.bankBranch || '-'}</span>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="declaration">
          <p className="declaration-title">Declaration:</p>
          <p className="declaration-text">
            I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
            I understand that any false information may result in rejection of my application or termination of employment. 
            I agree to abide by the rules and regulations of the company.
          </p>
        </div>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="signature-label">Applicant&apos;s Signature</p>
            <p className="signature-name">{registration.firstName} {registration.lastName}</p>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="signature-label">Date</p>
            <p className="signature-name">{formatDate(registration.submittedAt)}</p>
          </div>
        </div>

        {/* Office Use Section */}
        <div className="office-section">
          <p className="office-title">FOR OFFICE USE ONLY</p>
          <div className="office-grid">
            <div className="office-field">
              <span className="office-label">Verified By:</span>
              <div className="office-line"></div>
            </div>
            <div className="office-field">
              <span className="office-label">Approved By:</span>
              <div className="office-line"></div>
            </div>
            <div className="office-field">
              <span className="office-label">Employee Code:</span>
              <div className="office-line"></div>
            </div>
          </div>
          <div className="office-grid">
            <div className="office-field">
              <span className="office-label">Verification Date:</span>
              <div className="office-line"></div>
            </div>
            <div className="office-field">
              <span className="office-label">Approval Date:</span>
              <div className="office-line"></div>
            </div>
            <div className="office-field">
              <span className="office-label">Joining Date:</span>
              <div className="office-line"></div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        {registration.status !== 'pending' && (
          <div className={`status-info ${registration.status}`}>
            <div className="status-header">
              <UserCheck className="status-icon" />
              <span className="status-title">
                {registration.status === 'approved' ? 'Application Approved' : 'Application Rejected'}
              </span>
            </div>
            {registration.reviewedAt && (
              <p className="status-detail">Reviewed on: {formatDate(registration.reviewedAt)}</p>
            )}
            {registration.reviewedBy && (
              <p className="status-detail">Reviewed by: {registration.reviewedBy}</p>
            )}
            {registration.rejectionReason && (
              <p className="status-detail"><strong>Reason:</strong> {registration.rejectionReason}</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="form-footer">
          <p>This is a computer-generated application form.</p>
          <p>For queries, contact HR Department at hr@company.com or +91 9876543210</p>
        </div>
      </div>

      {/* Global Print Styles */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 15mm;
        }

        @media print {
          /* Hide everything by default */
          body > *:not(.application-form):not(.application-form *) {
            display: none !important;
          }
          
          /* Hide print button */
          .print-btn-container {
            display: none !important;
          }

          /* Show application form */
          .application-form {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
            line-height: 1.4 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }

          /* Reset all children visibility */
          .application-form * {
            visibility: visible !important;
            opacity: 1 !important;
          }

          /* Form header */
          .form-header {
            text-align: center;
            border-bottom: 2px double #333;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .form-title {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 4px 0;
          }
          .form-subtitle {
            font-size: 10pt;
            color: #666;
            margin: 0 0 12px 0;
          }
          .form-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9pt;
          }
          .label {
            color: #666;
          }
          .value {
            font-weight: 500;
          }
          .value-bold {
            font-weight: bold;
            color: #0284c7;
          }

          /* Photo */
          .photo-container {
            position: absolute;
            top: 60px;
            right: 60px;
          }
          .photo-box {
            width: 80px;
            height: 100px;
            border: 1px dashed #999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
            color: #666;
          }
          .photo-icon {
            display: none;
          }
          .photo-text, .photo-size {
            margin: 0;
            padding: 2px;
          }
          .photo-attached {
            color: #059669;
            margin: 0;
          }

          /* Sections */
          .section {
            margin-bottom: 16px;
          }
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            background: #f3f4f6;
            padding: 6px 10px;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-icon {
            display: none;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 16px;
            font-size: 10pt;
          }
          .detail-row {
            display: flex;
            gap: 8px;
          }
          .detail-label {
            color: #666;
            min-width: 120px;
          }
          .detail-value {
            font-weight: 500;
          }
          .detail-value.capitalize {
            text-transform: capitalize;
          }
          .detail-value.mono {
            font-family: monospace;
          }
          .address-section {
            margin-top: 8px;
            font-size: 10pt;
          }
          .address-box {
            border: 1px solid #ddd;
            padding: 6px 8px;
            background: #f9fafb;
            margin-top: 4px;
            font-weight: 500;
          }

          /* Checklist */
          .checklist {
            margin-top: 10px;
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 9pt;
          }
          .checklist-title {
            font-weight: 600;
            margin: 0 0 6px 0;
          }
          .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
          }
          .checklist-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .check-box {
            width: 14px;
            height: 14px;
            border: 1px solid #999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9pt;
          }
          .check-box.checked {
            background: #d1fae5;
            border-color: #059669;
            color: #059669;
          }
          .check-box.unchecked {
            background: #f3f4f6;
            color: #999;
          }
          .unchecked-text {
            color: #999;
          }

          /* Declaration */
          .declaration {
            border: 1px solid #ddd;
            padding: 10px;
            background: #f9fafb;
            margin-bottom: 16px;
            font-size: 9pt;
          }
          .declaration-title {
            font-weight: bold;
            margin: 0 0 6px 0;
          }
          .declaration-text {
            margin: 0;
            line-height: 1.5;
          }

          /* Signature */
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-top: 40px;
            text-align: center;
            font-size: 10pt;
          }
          .signature-box {
            padding-top: 40px;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-bottom: 6px;
          }
          .signature-label {
            font-weight: 500;
            margin: 0 0 2px 0;
          }
          .signature-name {
            color: #666;
            margin: 0;
          }

          /* Office Use */
          .office-section {
            margin-top: 20px;
            border-top: 2px solid #333;
            padding-top: 12px;
            font-size: 9pt;
          }
          .office-title {
            font-weight: bold;
            text-align: center;
            margin: 0 0 10px 0;
          }
          .office-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 8px;
          }
          .office-field {
            border: 1px solid #ddd;
            padding: 6px;
          }
          .office-label {
            color: #666;
          }
          .office-line {
            border-bottom: 1px dashed #999;
            margin-top: 20px;
            margin-bottom: 4px;
          }

          /* Status Info */
          .status-info {
            margin-top: 16px;
            padding: 10px;
            border: 1px solid;
            border-radius: 4px;
          }
          .status-info.approved {
            background: #d1fae5;
            border-color: #6ee7b7;
          }
          .status-info.rejected {
            background: #fee2e2;
            border-color: #fca5a5;
          }
          .status-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
          }
          .status-icon {
            display: none;
          }
          .status-detail {
            margin: 4px 0 0 0;
            font-size: 9pt;
          }

          /* Footer */
          .form-footer {
            margin-top: 16px;
            text-align: center;
            font-size: 8pt;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 8px;
          }
          .form-footer p {
            margin: 2px 0;
          }
        }

        /* Screen Styles */
        @media screen {
          .application-form {
            background: white;
            padding: 32px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .print-btn-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          }
          .form-header {
            text-align: center;
            border-bottom: 2px double #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .form-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 4px 0;
          }
          .form-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 16px 0;
          }
          .form-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
          }
          .label {
            color: #6b7280;
          }
          .value {
            font-weight: 500;
          }
          .value-bold {
            font-weight: bold;
            color: #0284c7;
          }
          .photo-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
          }
          .photo-box {
            width: 120px;
            height: 150px;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
          }
          .photo-icon {
            width: 40px;
            height: 40px;
            color: #9ca3af;
          }
          .photo-text, .photo-size {
            font-size: 12px;
            color: #6b7280;
            margin: 4px 0 0 0;
          }
          .photo-attached {
            font-size: 12px;
            color: #059669;
            margin: 4px 0 0 0;
          }
          .section {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            background: #f3f4f6;
            padding: 8px 12px;
            margin: 0 0 12px 0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-icon {
            width: 20px;
            height: 20px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 24px;
            font-size: 14px;
          }
          .detail-row {
            display: flex;
            gap: 8px;
          }
          .detail-label {
            color: #6b7280;
            min-width: 150px;
          }
          .detail-value {
            font-weight: 500;
          }
          .address-section {
            margin-top: 12px;
            font-size: 14px;
          }
          .address-box {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 4px;
            margin-top: 6px;
            font-weight: 500;
          }
          .checklist {
            margin-top: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            font-size: 14px;
          }
          .checklist-title {
            font-weight: 600;
            margin: 0 0 8px 0;
          }
          .checklist-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .checklist-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .check-box {
            width: 18px;
            height: 18px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          .check-box.checked {
            background: #d1fae5;
            border-color: #059669;
            color: #059669;
          }
          .check-box.unchecked {
            background: #f3f4f6;
            color: #9ca3af;
          }
          .unchecked-text {
            color: #9ca3af;
          }
          .declaration {
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            background: #f9fafb;
            margin-bottom: 24px;
            font-size: 14px;
          }
          .declaration-title {
            font-weight: bold;
            margin: 0 0 8px 0;
          }
          .declaration-text {
            margin: 0;
            line-height: 1.6;
          }
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin-top: 60px;
            text-align: center;
            font-size: 14px;
          }
          .signature-box {
            padding-top: 60px;
          }
          .signature-line {
            border-top: 1px solid #374151;
            margin-bottom: 8px;
          }
          .signature-label {
            font-weight: 500;
            margin: 0 0 4px 0;
          }
          .signature-name {
            color: #6b7280;
            margin: 0;
          }
          .office-section {
            margin-top: 32px;
            border-top: 2px solid #e5e7eb;
            padding-top: 16px;
            font-size: 14px;
          }
          .office-title {
            font-weight: bold;
            text-align: center;
            margin: 0 0 16px 0;
          }
          .office-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-bottom: 12px;
          }
          .office-field {
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 8px;
          }
          .office-label {
            color: #6b7280;
          }
          .office-line {
            border-bottom: 1px dashed #d1d5db;
            margin-top: 24px;
            margin-bottom: 8px;
          }
          .status-info {
            margin-top: 24px;
            padding: 16px;
            border: 1px solid;
            border-radius: 4px;
          }
          .status-info.approved {
            background: #d1fae5;
            border-color: #6ee7b7;
          }
          .status-info.rejected {
            background: #fee2e2;
            border-color: #fca5a5;
          }
          .status-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
          }
          .status-icon {
            width: 20px;
            height: 20px;
          }
          .status-detail {
            margin: 6px 0 0 0;
            font-size: 14px;
          }
          .form-footer {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
          }
          .form-footer p {
            margin: 4px 0;
          }
        }
      `}</style>
    </>
  );
}

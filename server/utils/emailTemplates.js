export const getInvoiceTemplate = (user, purchase, plan) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
            .content { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
            .body { padding: 40px; }
            .welcome { font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 0; }
            .badge { display: inline-block; background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
            .card { background: #f1f5f9; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; margin: 24px 0; }
            .details-label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .label { color: #64748b; }
            .value { font-weight: 600; color: #1e293b; }
            .total { display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #cbd5e1; font-size: 18px; font-weight: 800; color: #2563eb; }
            .cta { text-align: center; margin-top: 32px; }
            .button { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; }
            .footer { padding: 32px; text-align: center; font-size: 12px; color: #94a3b8; }
            .footer a { color: #2563eb; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="content">
                <div class="header">
                    <div style="background: rgba(255,255,255,0.2); width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h1>Powerfilling</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9;">Payment Successful</p>
                </div>
                <div class="body">
                    <h2 class="welcome">Hi ${user.name || 'User'},</h2>
                    <div class="badge">Success</div>
                    <p style="color: #475569; line-height: 1.6;">Thank you for your purchase! Your payment was successful and your tax plan is now active. You can start filing your return immediately.</p>
                    
                    <div class="card">
                        <div class="details-label">Order Summary</div>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">Plan Name</td>
                                <td align="right" style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${plan.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">Transaction ID</td>
                                <td align="right" style="padding: 10px 0; color: #1e293b; font-size: 12px; font-family: monospace; font-weight: 600;">${purchase.paymentId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">Date</td>
                                <td align="right" style="padding: 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${new Date(purchase.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <td style="padding: 16px 0 0; color: #2563eb; font-size: 18px; font-weight: 800; border-top: 2px solid #cbd5e1;">Amount Paid</td>
                                <td align="right" style="padding: 16px 0 0; color: #2563eb; font-size: 18px; font-weight: 800; border-top: 2px solid #cbd5e1;">₹${plan.price}.00</td>
                            </tr>
                        </table>
                    </div>

                    <div class="cta">
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">Access your dashboard to fill out forms and upload documents.</p>
                        <a href="https://powerfiling.com/dashboard" class="button">Go to Dashboard</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Powerfilling. All rights reserved.</p>
                    <p>Questions? Contact <a href="mailto:support@powerfiling.com">support@powerfiling.com</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getVerificationTemplate = (otp, type = 'Verification') => {
    const subjects = {
        'Verification': 'Verify your email address',
        'Login': 'Login verification code',
        'Reset': 'Password reset code'
    };

    const title = subjects[type] || 'Verification Code';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
            .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
            .content { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center; }
            .header { background: #2563eb; padding: 32px; color: #ffffff; }
            .body { padding: 40px; }
            .otp-box { background: #f8fafc; border: 2px dashed #e2e8f0; padding: 24px; border-radius: 12px; margin: 32px 0; }
            .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 0; }
            .footer { padding: 24px; background: #f1f5f9; font-size: 12px; color: #94a3b8; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="content">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px; font-weight: 800;">Powerfilling</h1>
                </div>
                <div class="body">
                    <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
                    <p style="color: #64748b; font-size: 15px;">Use the code below to complete your request. For security, please do not share this with anybody.</p>
                    
                    <div class="otp-box">
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <p style="color: #ef4444; font-size: 14px; font-weight: 500;">Valid for 10 minutes</p>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 32px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Powerfilling. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getStatusUpdateTemplate = (user, itr, status, remarks, updaterName, updaterEmail) => {
    const statusColors = {
        'Pending': '#f59e0b',
        'CA Reviewing': '#3b82f6',
        'Filed': '#10b981',
        'Completed': '#059669',
        'Rejected': '#ef4444'
    };

    const statusBg = {
        'Pending': '#fffbeb',
        'CA Reviewing': '#eff6ff',
        'Filed': '#ecfdf5',
        'Completed': '#f0fdf4',
        'Rejected': '#fef2f2'
    };

    const color = statusColors[status] || '#64748b';
    const bg = statusBg[status] || '#f8fafc';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
            .wrapper { width: 100%; background-color: #f8fafc; padding: 40px 0; }
            .content { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { background: #2563eb; padding: 32px; text-align: center; color: #ffffff; }
            .body { padding: 40px; }
            .status-badge { display: inline-block; background: ${bg}; color: ${color}; padding: 6px 16px; border-radius: 9999px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid ${color}20; }
            .info-card { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .info-label { color: #64748b; font-weight: 500; }
            .info-value { color: #1e293b; font-weight: 700; }
            .remarks-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-top: 20px; font-style: italic; color: #92400e; font-size: 14px; }
            .button { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; }
            .footer { padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="content">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px; font-weight: 800;">Powerfilling</h1>
                    <p style="margin: 8px 0 0; opacity: 0.9;">ITR Filing Progress Update</p>
                </div>
                <div class="body">
                    <h2 style="color: #0f172a; margin-top:0;">Hi ${user.name},</h2>
                    <p style="color: #64748b; line-height: 1.6;">There has been an update to your ITR filing. Our experts are working diligently on your case.</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Current Status</p>
                        <div class="status-badge">${status}</div>
                    </div>

                    <div class="info-card">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="left" style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 500;">Order ID</td>
                                <td align="right" style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 700;">#${(itr.purchaseId?._id || itr.purchaseId || '').toString()}</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 500;">Service Plan</td>
                                <td align="right" style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${itr.purchaseId?.planId?.name || itr.purchaseId?.planName || 'Tax Filing'}</td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: 500;">Updated By</td>
                                <td align="right" style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 700;">
                                    ${updaterName || 'Our Expert CA'}<br>
                                    <span style="font-size: 11px; font-weight: 500; color: #64748b;">${updaterEmail || ''}</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    ${remarks ? `
                        <div class="remarks-box">
                            <strong>Note from Expert:</strong><br>
                            "${remarks}"
                        </div>
                    ` : ''}

                    <div style="text-align: center;">
                        <a href="https://powerfiling.com/dashboard?tab=orders" class="button" style="color: #ffffff !important; background-color: #2563eb;">View Order Details</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Powerfilling. All rights reserved.</p>
                    <p>This is an automated notification. Please do not reply to this email.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

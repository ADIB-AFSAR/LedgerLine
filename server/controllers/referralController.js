import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';

// ── REWARD MAP ────────────────────────────────────────────────────────────────
// Keys are matched case-insensitively against plan.name
// Add or adjust plan names to exactly match what's stored in your Plan collection
// OLD MAP (based on old plan names):
// export const PLAN_REWARD_MAP = {
//     'salary itr (basic)': 50,
//     'salary itr (premium)': 100,
//     'capital gain itr': 200,
//     'crypto / trading itr': 300,
//     'crypto/trading itr': 300,
//     'foreign / nri income itr': 300,
//     'foreign/nri income itr': 300,
//     'gst registration': 200,
//     'gst return filing': 100,
//     'huf registration': 200,
//     'llp registration': 500,
//     'private limited company registration': 1000,
//     'roc annual compliance': 750
// };

// NEW MAP (based on NEW plan names):
export const PLAN_REWARD_MAP = {
    'salary (basic) itr': 50,
    'salary (premium)': 100,
    'capital gain': 200,
    'foreign/nri income': 300,
    'business & profession': 200,
    'f&o trading': 300,
    'house property': 100,
    'crypto trading': 300,
    'huf filing': 150,
    'gst registration': 200,
    'gst filing': 100,
    'huf registration': 200,
    'company registration': 1000,
    'llp registration': 500,
    'tds filing': 150,
    'pf & esic': 150
};

// ── MILESTONE BONUSES ─────────────────────────────────────────────────────────
const MILESTONES = [
    { count: 5,  bonus: 500,  tier: 'silver',  label: '5 Referrals Bonus' },
    { count: 10, bonus: 1500, tier: 'gold',    label: '10 Referrals Bonus' },
    { count: 25, bonus: 0,    tier: 'partner', label: 'Premium Referral Partner' }
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const getPlanReward = (planName = '') => {
    const key = planName.trim().toLowerCase();
    return PLAN_REWARD_MAP[key] ?? null;
};

const checkAndApplyMilestone = async (referrer) => {
    const count = referrer.totalReferrals;

    const milestones = [
        { count: 5,  bonus: 500,  tier: 'silver',  label: '5 Referrals Bonus' },
        { count: 10, bonus: 1500, tier: 'gold',    label: '10 Referrals Bonus' },
        { count: 25, bonus: 0,    tier: 'partner', label: 'Premium Referral Partner' }
    ];

    for (const m of milestones) {
        if (count >= m.count) {
            // Check if this milestone bonus was already given
            const alreadyGiven = referrer.referralHistory.some(
                h => h.isBonus && h.planName === m.label
            );

            if (!alreadyGiven) {
                // First time crossing this milestone — credit bonus
                if (m.bonus > 0) {
                    referrer.coins += m.bonus;
                    referrer.referralHistory.push({
                        planName: m.label,
                        coinsEarned: m.bonus,
                        isBonus: true,
                        earnedAt: new Date()
                    });
                }
                referrer.referralTier = m.tier;
            }
        }
    }
};

// ── CORE CREDIT FUNCTION (called from paymentController) ─────────────────────
// Call this after a successful first purchase is confirmed
export const creditReferralCoins = async ({ buyerUserId, planName }) => {
    console.log('[Referral Debug] buyerUserId:', buyerUserId);
    console.log('[Referral Debug] planName received:', planName);
    console.log('[Referral Debug] reward found:', getPlanReward(planName));
    try {
        const buyer = await User.findById(buyerUserId);
        console.log('[Referral Debug] buyer found:', !!buyer);
        console.log('[Referral Debug] referredBy:', buyer?.referredBy);
        console.log('[Referral Debug] rewardCredited:', buyer?.referralRewardCredited);
        if (!buyer) return;

        // Guard: only credit on first purchase + must have a referrer
        if (buyer.referralRewardCredited || !buyer.referredBy) return;

        // Guard: self-referral (should not happen but double-check)
        if (buyer.referredBy.toString() === buyerUserId.toString()) return;

        const reward = getPlanReward(planName);
        if (!reward) {
            console.warn(`[Referral] No reward defined for plan: "${planName}"`);
            return;
        }

        const referrer = await User.findById(buyer.referredBy);
        if (!referrer) return;

        // Credit coins
        referrer.coins += reward;
        referrer.totalReferrals += 1;
        referrer.referralHistory.push({
            referredUserId: buyer._id,
            referredUserName: buyer.name,
            planName,
            coinsEarned: reward,
            isBonus: false
        });

        // Check milestones
        await checkAndApplyMilestone(referrer);

        await referrer.save({ validateBeforeSave: false });

        // Mark buyer so we never credit twice
        await User.findByIdAndUpdate(buyerUserId, { referralRewardCredited: true });

        // Notify referrer by email
        try {
            await sendEmail({
                email: referrer.email,
                subject: '🎉 You earned referral coins! - Powerfiling',
                message: `You earned ${reward} coins because ${buyer.name} made their first purchase (${planName}).`,
                html: `
                    <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
                        <h2 style="color:#1d4ed8">You earned referral coins!</h2>
                        <p>Your friend <strong>${buyer.name}</strong> just made their first purchase on Powerfiling.</p>
                        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:16px 0;text-align:center">
                            <p style="margin:0;font-size:13px;color:#166534">Coins credited</p>
                            <p style="margin:4px 0 0;font-size:32px;font-weight:bold;color:#15803d">+${reward}</p>
                        </div>
                        <p>Service purchased: <strong>${planName}</strong></p>
                        <p>Your current balance: <strong>${referrer.coins} coins</strong></p>
                        <p style="font-size:12px;color:#6b7280">1 coin = ₹1 &nbsp;|&nbsp; Minimum withdrawal: 50 coins</p>
                        <a href="${process.env.CLIENT_URL}/dashboard/referrals" 
                           style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:12px">
                            View My Coins
                        </a>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('[Referral] Email notification failed:', emailErr);
        }

        console.log(`[Referral] Credited ${reward} coins to ${referrer.email} for ${buyer.name}'s purchase of ${planName}`);
    } catch (err) {
        // Never let referral errors crash the payment flow
        console.error('[Referral] creditReferralCoins error:', err);
    }
};

// ── ROUTES ────────────────────────────────────────────────────────────────────

// @desc    Get my referral info (coins, history, withdrawal requests)
// @route   GET /api/v1/referral/me
// @access  Private
export const getMyReferral = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Not authorized', 401));
    }
    const user = await User.findById(req.user._id || req.user.id)
        .select('coins totalReferrals referralTier referralHistory withdrawalRequests name email');

    const referralLink = `${process.env.CLIENT_URL}?ref=${Buffer.from(user._id.toString()).toString('base64')}`;

    res.status(200).json({
        success: true,
        data: {
            coins: user.coins,
            totalReferrals: user.totalReferrals,
            referralTier: user.referralTier,
            referralLink,
            referralCode: Buffer.from(user._id.toString()).toString('base64'),
            referralHistory: user.referralHistory,
            withdrawalRequests: user.withdrawalRequests
        }
    });
});

// @desc    Request coin withdrawal (min 50 coins)
// @route   POST /api/v1/referral/withdraw
// @access  Private
export const requestWithdrawal = asyncHandler(async (req, res, next) => {
    
    const user = await User.findById(req.user.id);

    const { upiId } = req.body; // ← add this

    if (!upiId || !upiId.includes('@')) {
        return next(new AppError('Please provide a valid UPI ID (e.g. name@upi)', 400));
    }

    if (user.coins < 50) {
        return next(new AppError(`Minimum withdrawal is 50 coins. You have ${user.coins} coins.`, 400));
    }

    // Check if there's already a pending withdrawal
    const hasPending = user.withdrawalRequests.some(r => r.status === 'pending');
    if (hasPending) {
        return next(new AppError('You already have a pending withdrawal request. Please wait for it to be processed.', 400));
    }

    const amount = user.coins;

    user.withdrawalRequests.push({
        amount,
        status: 'pending',
        upiId,
        requestedAt: new Date()
    });

    // Temporarily hold coins (don't reset yet — admin approves first)
    await user.save({ validateBeforeSave: false });

    // Email to admin
    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `[Withdrawal Request] ${user.name} - ${amount} coins`,
            message: `${user.name} (${user.email}) has requested withdrawal of ${amount} coins (₹${amount}).`,
            html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
                    <h2 style="color:#dc2626">Coin Withdrawal Request</h2>
                    <table style="width:100%;border-collapse:collapse;font-size:14px">
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${user.name}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${user.email}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Mobile</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${user.mobile || 'N/A'}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Coins</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${amount}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Amount</strong></td><td style="padding:8px;border:1px solid #e5e7eb">₹${amount}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>UPI ID</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${upiId}</td></tr>
                        <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Total Referrals</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${user.totalReferrals}</td></tr>
                    </table>
                    <a href="${process.env.CLIENT_URL}/admin/withdrawals" 
                       style="display:inline-block;background:#dc2626;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-top:16px">
                        Process in Admin Panel
                    </a>
                    <p style="font-size:12px;color:#6b7280;margin-top:16px">Please process within 24 hours as per policy.</p>
                </div>
            `
        });
    } catch (emailErr) {
        console.error('[Referral] Admin withdrawal email failed:', emailErr);
    }

    // Confirm email to user
    try {
        await sendEmail({
            email: user.email,
            subject: 'Withdrawal Request Received - Powerfiling',
            message: `Your withdrawal request of ${amount} coins (₹${amount}) has been received and will be processed within 24 hours.`,
            html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
                    <h2 style="color:#1d4ed8">Withdrawal Request Received</h2>
                    <p>Your request to withdraw <strong>${amount} coins (₹${amount})</strong> has been submitted.</p>
                    <p>Our team will process this within <strong>24 hours</strong> and transfer the amount to your account.</p>
                    <p style="font-size:12px;color:#6b7280">If you have any questions, please contact support.</p>
                </div>
            `
        });
    } catch (emailErr) {
        console.error('[Referral] User withdrawal confirmation email failed:', emailErr);
    }

    res.status(200).json({
        success: true,
        message: `Withdrawal request for ${amount} coins (₹${amount}) submitted. You will be notified within 24 hours.`
    });
});

// @desc    Admin — get all pending withdrawal requests
// @route   GET /api/v1/referral/admin/withdrawals
// @access  Private/Admin
export const getWithdrawalRequests = asyncHandler(async (req, res, next) => {
    const users = await User.find({
        'withdrawalRequests.status': 'pending'
    }).select('name email mobile coins totalReferrals referralTier withdrawalRequests');

    const requests = [];
    users.forEach(user => {
        user.withdrawalRequests
            .filter(r => r.status === 'pending')
            .forEach(r => {
                requests.push({
                    requestId: r._id,
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    userMobile: user.mobile,
                    currentCoins: user.coins,
                    requestedAmount: r.amount,
                    upiId: r.upiId,
                    requestedAt: r.requestedAt,
                    totalReferrals: user.totalReferrals,
                    tier: user.referralTier
                });
            });
    });

    // Sort by oldest first (FIFO)
    requests.sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});

// @desc    Admin — approve or reject a withdrawal request
// @route   PUT /api/v1/referral/admin/withdrawals/:userId/:requestId
// @access  Private/Admin
export const processWithdrawal = asyncHandler(async (req, res, next) => {
    const { userId, requestId } = req.params;
    const { action, adminNote } = req.body; // action: 'approve' | 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
        return next(new AppError('Action must be "approve" or "reject"', 400));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError('User not found', 404));

    const withdrawal = user.withdrawalRequests.id(requestId);
    if (!withdrawal) return next(new AppError('Withdrawal request not found', 404));
    if (withdrawal.status !== 'pending') {
        return next(new AppError('This request has already been processed', 400));
    }

    withdrawal.status = action === 'approve' ? 'approved' : 'rejected';
    withdrawal.processedAt = new Date();
    withdrawal.adminNote = adminNote || '';
    

    if (action === 'approve') {
        // Reset coins to 0
        user.coins = 0;
    }
    // On reject — coins stay as-is, user can try again

    await user.save({ validateBeforeSave: false });

    // Notify user
    const subject = action === 'approve'
        ? 'Withdrawal Approved - Powerfiling'
        : 'Withdrawal Request Update - Powerfiling';

    const html = action === 'approve'
        ? `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
               <h2 style="color:#16a34a">Withdrawal Approved!</h2>
               <p>Your withdrawal of <strong>₹${withdrawal.amount}</strong> has been approved and will be credited to your account shortly.</p>
               <p>Your coin balance has been reset to 0. Keep referring to earn more!</p>
               ${adminNote ? `<p><strong>Note from admin:</strong> ${adminNote}</p>` : ''}
           </div>`
        : `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
               <h2 style="color:#dc2626">Withdrawal Not Processed</h2>
               <p>Your withdrawal request of <strong>₹${withdrawal.amount}</strong> could not be processed at this time.</p>
               <p>Your coins have been retained in your account.</p>
               ${adminNote ? `<p><strong>Reason:</strong> ${adminNote}</p>` : ''}
               <p>Please contact support if you have any questions.</p>
           </div>`;

    try {
        await sendEmail({ email: user.email, subject, html, message: subject });
    } catch (emailErr) {
        console.error('[Referral] Withdrawal status email failed:', emailErr);
    }

    res.status(200).json({
        success: true,
        message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        data: {
            userName: user.name,
            amount: withdrawal.amount,
            status: withdrawal.status,
            coinsRemaining: user.coins
        }
    });
});

// @desc    Validate a referral code (used at checkout)
// @route   POST /api/v1/referral/validate
// @access  Private
export const validateReferralCode = asyncHandler(async (req, res, next) => {
    const { referralCode } = req.body;

    if (!referralCode) {
        return next(new AppError('Referral code is required', 400));
    }

    let referrerId;
    try {
        referrerId = Buffer.from(referralCode, 'base64').toString('utf-8');
    } catch {
        return next(new AppError('Invalid referral code', 400));
    }

    // Self-referral check
    if (referrerId === req.user.id.toString()) {
        return next(new AppError('You cannot use your own referral code', 400));
    }

    // Check if buyer already used a referral
    if (req.user.referredBy) {
        return next(new AppError('A referral code has already been applied to your account', 400));
    }

    // Check if first purchase already happened
    if (req.user.referralRewardCredited) {
        return next(new AppError('Referral rewards are only applicable on your first purchase', 400));
    }

    const referrer = await User.findById(referrerId).select('name');
    if (!referrer) {
        return next(new AppError('Invalid referral code', 400));
    }

    res.status(200).json({
        success: true,
        message: `Referral code applied! Referred by ${referrer.name}`,
        referrerName: referrer.name
    });
});

// @desc    Apply referral code to current user's account
// @route   POST /api/v1/referral/apply
// @access  Private
export const applyReferralCode = asyncHandler(async (req, res, next) => {
    const { referralCode } = req.body;

    if (!referralCode) return next(new AppError('Referral code is required', 400));

    let referrerId;
    try {
        referrerId = Buffer.from(referralCode, 'base64').toString('utf-8');
    } catch {
        return next(new AppError('Invalid referral code', 400));
    }

    if (referrerId === req.user.id.toString()) {
        return next(new AppError('You cannot use your own referral code', 400));
    }

    if (req.user.referredBy) {
        return next(new AppError('A referral code has already been applied to your account', 400));
    }

    if (req.user.referralRewardCredited) {
        return next(new AppError('Referral rewards are only applicable on your first purchase', 400));
    }

    const referrer = await User.findById(referrerId).select('name');
    if (!referrer) return next(new AppError('Invalid referral code', 400));

    const user = await User.findById(req.user.id);
    user.referredBy = referrerId;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `Referral code applied! You were referred by ${referrer.name}.`
    });
});
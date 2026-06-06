import CryptoJS from 'crypto-js';
 
const SECRET = import.meta.env.VITE_REFERRAL_SECRET || 'pf-ref-secret-2024';
const STORAGE_KEY = 'pf_ref';
const EXPIRY_DAYS = 30;
 
// ── Encrypt / Decrypt ─────────────────────────────────────────────────────────
 
const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET).toString();
 
const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return null;
    }
};
 
// ── Storage helpers ───────────────────────────────────────────────────────────
 
/**
 * Save referral code to localStorage (encrypted, with expiry)
 * Called on landing page when ?ref= param is present
 */
export const saveReferralCode = (rawCode) => {
    if (!rawCode) return;
    try {
        const payload = JSON.stringify({
            code: rawCode,
            expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
        });
        localStorage.setItem(STORAGE_KEY, encrypt(payload));
    } catch (err) {
        console.warn('[Referral] Could not save referral code:', err);
    }
};
 
/**
 * Read and decrypt referral code from localStorage.
 * Returns null if missing, expired, or tampered.
 */
export const getReferralCode = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
 
        const decrypted = decrypt(raw);
        if (!decrypted) {
            clearReferralCode();
            return null;
        }
 
        const { code, expiresAt } = JSON.parse(decrypted);
 
        if (Date.now() > expiresAt) {
            clearReferralCode();
            return null;
        }
 
        return code;
    } catch {
        clearReferralCode();
        return null;
    }
};
 
/**
 * Remove referral code from localStorage
 * Called after it has been successfully applied
 */
export const clearReferralCode = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
};

export const captureReferralFromURL = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        console.log('[Referral Debug] URL ref param:', ref); // ← add this
        if (ref) {
            saveReferralCode(ref);
        }
    } catch (err) {
        console.warn('[Referral] Could not capture ref param:', err);
    }
};
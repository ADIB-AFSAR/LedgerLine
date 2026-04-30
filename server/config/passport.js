import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { getAdminModel } from '../config/index.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/v1/auth/google/callback',
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let rawState = req.query.state;
                let intent = undefined;
                
                if (rawState) {
                    try {
                        const decodedStr = Buffer.from(rawState, 'base64').toString('utf-8');
                        const decodedState = JSON.parse(decodedStr);
                        if (decodedState.intent) {
                            intent = decodedState.intent;
                        }
                    } catch (e) {
                        // Fallback
                        intent = rawState;
                    }
                }
                // Cold start protection
                let currentAdmin = await getAdminModel();
                let currentUser = User;

                const Model = intent === 'admin' ? currentAdmin : currentUser;

                if (!Model) {
                    console.error("Auth Error: Model not initialized", { intent, isAdminNull: !currentAdmin, isUserNull: !currentUser });
                    return done(new Error("Authentication system is warming up. Please refresh in 2 seconds."), null);
                }

                // Check if user already exists
                let user = await Model.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with email
                if (profile.emails && profile.emails.length > 0) {
                    user = await Model.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link googleId to existing user
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // If not, create new user
                user = await Model.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'google-login-dummy-password-' + Date.now(),
                    mobile: `G-${profile.id}`,
                    isMobileVerified: false,
                    isEmailVerified: true,
                    role: 'user' // All new users start with 'user' role until approved
                });

                done(null, user);
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const AdminModel = await getAdminModel();
        if (!AdminModel || !User) {
            return done(new Error("Database not initialized"), null);
        }
        // We try to find in Admin first, then User
        let user = await AdminModel.findById(id);
        if (!user) {
            user = await User.findById(id);
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

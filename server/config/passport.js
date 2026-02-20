import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/v1/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with email
                if (profile.emails && profile.emails.length > 0) {
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link googleId to existing user
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                }

                // If not, create new user
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'google-login-dummy-password-' + Date.now(), // Randomize to avoid issues
                    mobile: `G-${profile.id}`, // Unique placeholder
                    isMobileVerified: false,
                    isEmailVerified: true // Google users are verified
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
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

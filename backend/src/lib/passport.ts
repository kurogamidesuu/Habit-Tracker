import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './prisma';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingGoogleUser = await prisma.user.findUnique({
      where: {
        googleId: profile.id,
      },
    });

    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }

    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error("No email from Google"), false);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      const updatedUser = await prisma.user.update({
        where: { email: existingUser.email },
        data: {
          googleId: profile.id
        }
      });

      return done(null, updatedUser);
    }

    const newUser = await prisma.user.create({
      data: {
        username: profile.displayName,
        email: email,
        googleId: profile.id,
      }
    });

    return done(null, newUser);
  } catch (e) {
    done(e, false);
  }
}))

export default passport;
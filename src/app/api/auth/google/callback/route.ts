import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { setCustomerSessionCookie } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const origin = url.origin;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/account?error=${encodeURIComponent(error || "Google sign-in was cancelled.")}`);
  }

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "778428134705-2gvaupmnrvbhgmatcds1bhtjfspgmd8j.apps.googleusercontent.com";

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google Token Exchange Failed:", tokenData);
      return NextResponse.redirect(`${origin}/account?error=${encodeURIComponent("Google token exchange failed.")}`);
    }

    // Fetch Google User Profile
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${origin}/account?error=${encodeURIComponent("Failed to retrieve Google profile email.")}`);
    }

    const cleanEmail = profile.email.trim().toLowerCase();
    const displayName = profile.name || profile.given_name || cleanEmail.split("@")[0];
    const avatarUrl = profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`;

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      const dummyPhone = normalizePhone(`99${Math.floor(10000000 + Math.random() * 90000000)}`);
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          phone: dummyPhone,
          password: hashPassword("google_oauth_" + (profile.sub || Date.now())),
          avatarUrl: avatarUrl,
          isVerified: profile.email_verified ?? true,
        },
      });
    } else if (!user.avatarUrl && avatarUrl) {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl },
      }).catch(() => null);
    }

    const response = NextResponse.redirect(`${origin}/account?login=success`);
    await setCustomerSessionCookie(response, {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return response;
  } catch (err: any) {
    console.error("Google Callback Error:", err);
    return NextResponse.redirect(`${origin}/account?error=${encodeURIComponent(err.message || "An unexpected error occurred.")}`);
  }
}

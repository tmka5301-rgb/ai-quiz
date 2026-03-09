import "./globals.css";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header>
            <Show when="signed-in">
              <UserButton></UserButton>
            </Show>

            <Show when={"signed-out"}>
              <SignInButton>Sign in</SignInButton>
              <SignUpButton>Sign up</SignUpButton>
            </Show>
          </header>

          <Show when="signed-out">Hello</Show>

          <Show when="signed-out">{children}</Show>
        </ClerkProvider>
      </body>
    </html>
  );
}

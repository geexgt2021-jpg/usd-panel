export const metadata = {
  title: "USD Trading Panel",
  description: "USD PWA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
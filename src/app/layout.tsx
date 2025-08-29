import "./globals.css"

export const metadata = { title: 'Nao Medical - Translator', description: 'Healthcare Translation Web App' }


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="min-h-screen antialiased">
{children}
</body>
</html>
)
}
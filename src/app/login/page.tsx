import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/shared/Logo"

const Login = () => {
  return (
    <main className="min-h-screen flex items-center justify-center space-y-4">
      <Logo />
      <p> Welcome Back <br/> <span>Sign in to your ccounts</span></p>

      <Card className="bg-surface  border-border rounded-radius-lg shadow-md p-6 w-full max-w-auth-form-width">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Login to your account</CardDescription>
        </CardContent>
      </Card>
     
    </main>
  )
}

export default Login